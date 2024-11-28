import { ReactNode, createContext, useState, useEffect } from 'react';
import { TurnkeyClient } from '@turnkey/http';
import * as turnkeyRPC from '~/lib/turnkey-rpc';
import { stampGetWhoami } from '~/lib/turnkey';

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

  // Implement the login function with overloads
  const login: LoginFunction = async (
    method: 'OTP_AUTH' | 'PASSKEY' | 'EMAIL',
    params: any
  ): Promise<void> => {
    console.log('login', method, params);
    if (method === 'OTP_AUTH') {
      const response = await turnkeyRPC.initOTPAuth(params);
      console.log(response);
    } else if (method === 'PASSKEY') {
      if (!isSupported()) {
        throw new Error('Passkeys are not supported on this device');
      }

      // const stamper = new PasskeyStamper({
      //   rpId: 'localhost',
      // });

      // const client = new TurnkeyClient(
      //   { baseUrl: 'https://api.turnkey.com' },
      //   stamper
      // );
      // console.log('these');
      // const signedRequest = await client.stampGetWhoami({
      //   organizationId: process.env.EXPO_PUBLIC_TURNKEY_ORGANIZATION_ID ?? '',
      // });
      // console.log(signedRequest);
      // const whoami = await stampGetWhoami(
      //   process.env.EXPO_PUBLIC_TURNKEY_ORGANIZATION_ID ?? ''
      // );
      // console.log(whoami);
      console.log('params', params);
      // ID isn't visible by users, but needs to be random enough and valid base64 (for Android)
      const userId = 'lol'; // Buffer.from(String(Date.now())).toString('base64');
      console.log(userId);
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
          name: `User ${new Date().toISOString()}`,
          displayName: `User ${new Date().toISOString()}`,
        },
        authenticatorSelection: {
          residentKey: 'required',
          requireResidentKey: true,
          userVerification: 'preferred',
        },
      }).catch((error) => {
        console.log('error', error);
      });
      console.log(authenticatorParams);
      // const result = await createSubOrg({
      //   email,
      //   passkey: authenticatorParams,
      // });
      // console.log(result);
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
