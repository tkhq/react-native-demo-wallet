import { ReactNode, createContext, useState, useEffect } from 'react';
import { TurnkeyClient } from '@turnkey/http';
import { createSubOrg, getSubOrgId, initOTPAuth } from '~/lib/turnkey';

import {
  PasskeyStamper,
  createPasskey,
  isSupported,
} from '@turnkey/react-native-passkey-stamper';

export interface TurnkeyClientType {
  client: TurnkeyClient | undefined;
  login: {
    (
      method: 'OTP_AUTH',
      params: { otpType: string; contact: string }
    ): Promise<void>;
    (method: 'PASSKEY', params: {}): Promise<void>;
    (method: 'EMAIL', params: {}): Promise<void>;
  };
}

export const TurnkeyContext = createContext<TurnkeyClientType>({
  client: undefined,
  login: async () => Promise.resolve(),
});

interface TurnkeyProviderProps {
  children: ReactNode;
}

// Define the overloads as a type
type LoginFunction = {
  (
    method: 'OTP_AUTH',
    params: { otpType: string; contact: string }
  ): Promise<void>;
  (method: 'PASSKEY', params: { email?: string }): Promise<void>;
  (method: 'EMAIL', params: {}): Promise<void>;
};

export const TurnkeyProvider: React.FC<TurnkeyProviderProps> = ({
  children,
}) => {
  const [client, setClient] = useState<TurnkeyClient | undefined>(undefined);

  useEffect(() => {
    (async () => {
      // const newClient = new TurnkeyClient({
      //   baseUrl: process.env.EXPO_PUBLIC_TURNKEY_API_BASE_URL,
      //   stamper: await createAPIKeyStamper(),
      // });
      // setClient(newClient);
    })();
  }, []);

  // Implement the login function with overloads
  const login: LoginFunction = async (
    method: 'OTP_AUTH' | 'PASSKEY' | 'EMAIL',
    params: any
  ): Promise<void> => {
    console.log('login', method, params, client);
    // if (!client) {
    //   return Promise.reject(new Error('Client is not initialized'));
    // }
    console.log('method === PASSKEY', method === 'PASSKEY');
    if (method === 'OTP_AUTH') {
      const response = await initOTPAuth(params);
      console.log(response);
    } else if (method === 'PASSKEY') {
      console.log('isSupported', isSupported());
      if (!isSupported()) {
        throw new Error('Passkeys are not supported on this device');
      }
      const email = params.email;
      const subOrgId = await getSubOrgId(email);
      console.log('subOrgId', subOrgId, email, params);

      if (!subOrgId) {
        // ID isn't visible by users, but needs to be random enough and valid base64 (for Android)
        const userId = Buffer.from(String(Date.now())).toString('base64');

        const authenticatorParams = await createPasskey({
          // This doesn't matter much, it will be the name of the authenticator persisted on the Turnkey side.
          // Won't be visible by default.
          authenticatorName: 'End-User Passkey',
          rp: {
            id: 'localhost',
            name: 'Passkey App',
          },
          user: {
            id: userId,
            // ...but name and display names are
            // We insert a human-readable date time for ease of use
            name: `User ${new Date().toISOString()}`,
            displayName: `User ${new Date().toISOString()}`,
          },
          authenticatorSelection: {
            residentKey: 'required',
            requireResidentKey: true,
            userVerification: 'preferred',
          },
        });
        const result = await createSubOrg({
          email,
          passkey: authenticatorParams,
        });
        console.log(result);
      }
    } else if (method === 'EMAIL') {
      // Implement Email authentication logic here using the passkeyClient
    }
    return Promise.resolve();
  };

  return (
    <TurnkeyContext.Provider
      value={{
        client,
        login,
      }}
    >
      {children}
    </TurnkeyContext.Provider>
  );
};
