import { ReactNode, createContext, useEffect, useState } from 'react';
import { TurnkeyClient } from '@turnkey/http';
import * as turnkeyRPC from '~/lib/turnkey-rpc';

import {
  createPasskey,
  isSupported,
} from '@turnkey/react-native-passkey-stamper';
import { useRouter } from 'expo-router';
import { useSession } from '~/hooks/use-session';
import { ApiKeyStamper } from '@turnkey/api-key-stamper';
import { User } from '~/lib/types';
import { getAddress } from 'viem';
import { toast } from 'sonner-native';

export interface TurnkeyClientType {
  client: TurnkeyClient | undefined;
  login: LoginFunction;
  completeLogin: CompleteLoginFunction;
  updateUser: ({
    email,
    phone,
  }: {
    email?: string;
    phone?: string;
  }) => Promise<void>;
  clearError: () => void;
  error: string | undefined;
  loading: boolean;
  user: User | undefined;
}

export const TurnkeyContext = createContext<TurnkeyClientType>({
  client: undefined,
  login: async () => Promise.resolve(),
  completeLogin: async () => Promise.resolve(),
  updateUser: async () => Promise.resolve(),
  clearError: () => {},
  error: undefined,
  loading: false,
  user: undefined,
});

interface TurnkeyProviderProps {
  children: ReactNode;
}

// Define the overloads as a type
type LoginFunction = {
  (
    method: 'OTP_AUTH',
    params: {
      otpType: 'OTP_TYPE_EMAIL' | 'OTP_TYPE_SMS';
      contact: string;
    }
  ): Promise<void>;
  (method: 'PASSKEY', params: { email?: string }): Promise<void>;
  (method: 'EMAIL', params: {}): Promise<void>;
};

type CompleteLoginFunction = {
  (
    method: 'OTP_AUTH',
    params: { otpId?: string; otpCode: string }
  ): Promise<void>;
};

export const TurnkeyProvider: React.FC<TurnkeyProviderProps> = ({
  children,
}) => {
  const [client, setClient] = useState<TurnkeyClient | undefined>(undefined);
  const router = useRouter();
  const { createEmbeddedKey, createSession, session } = useSession();
  // TODO: Refactor to useReducer, and set otpId for action INIT_OTP_AUTH
  const [otpId, setOtpId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [subOrgId, setSubOrgId] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    if (session) {
      (async () => {
        const stamper = new ApiKeyStamper({
          apiPrivateKey: session.privateKey,
          apiPublicKey: session.publicKey.slice(2),
        });
        const client = new TurnkeyClient(
          { baseUrl: 'https://api.turnkey.com' },
          stamper
        );
        setClient(client);

        const whoami = await client.getWhoami({
          organizationId: process.env.EXPO_PUBLIC_TURNKEY_ORGANIZATION_ID ?? '',
        });

        if (whoami.userId && whoami.organizationId) {
          const [walletsResponse, userResponse] = await Promise.all([
            client.getWallets({
              organizationId: whoami.organizationId,
            }),
            client.getUser({
              organizationId: whoami.organizationId,
              userId: whoami.userId,
            }),
          ]);

          const wallets = await Promise.all(
            walletsResponse.wallets.map(async (wallet) => {
              const accounts = await client.getWalletAccounts({
                organizationId: whoami.organizationId,
                walletId: wallet.walletId,
              });
              return {
                name: wallet.walletName,
                id: wallet.walletId,
                accounts: accounts.accounts.map((account) =>
                  getAddress(account.address)
                ),
              };
            })
          );

          const user = userResponse.user;

          setUser({
            id: user.userId,
            userName: user.userName,
            email: user.userEmail,
            phoneNumber: user.userPhoneNumber,
            organizationId: whoami.organizationId,
            wallets,
          });
        }

        // router.push('/dashboard');
      })();
    }
  }, [session]);

  const login: LoginFunction = async (
    method: 'OTP_AUTH' | 'PASSKEY' | 'EMAIL',
    params: any
  ): Promise<void> => {
    console.log('login', method, params);
    if (method === 'OTP_AUTH') {
      const response = await turnkeyRPC.initOTPAuth(params);
      console.log(response);
      if (response.otpId) {
        setOtpId(response.otpId);
        setSubOrgId(response.organizationId);
        router.push('/otp-auth');
      }
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

  const completeLogin: CompleteLoginFunction = async (method, params) => {
    console.log('completeLogin', method, params);
    setLoading(true);
    setError(undefined);
    try {
      switch (method) {
        case 'OTP_AUTH':
          if (!subOrgId) {
            throw new Error('Sub-organization ID not set');
          }
          const targetPublicKey = await createEmbeddedKey();

          const result = await turnkeyRPC.otpAuth({
            otpId: otpId ?? params.otpId ?? '',
            otpCode: params.otpCode,
            targetPublicKey,
            organizationId: subOrgId,
          });
          console.log(result);
          if (result.credentialBundle) {
            const session = await createSession(result.credentialBundle);
            console.log(session);
            router.replace('/dashboard');
          }

          break;
      }
    } catch (error: any) {
      const errorMessage = {
        5: 'Code expired. Please try again.',
        3: 'Invalid code. Please try again.',
      }[error?.code as number];
      console.log('completeLogin', error);
      setError(errorMessage ?? 'Error please try again');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userDetails: {
    email?: string;
    phone?: string;
  }) => {
    if (!client || !user) return;

    const parameters = {
      userId: user.id,
      userTagIds: [],
      ...userDetails,
    };

    try {
      await client.updateUser({
        type: 'ACTIVITY_TYPE_UPDATE_USER',
        timestampMs: Date.now().toString(),
        organizationId: user.organizationId,
        parameters,
      });
      toast.success('Info saved 🎉');
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const clearError = () => {
    setError(undefined);
  };

  return (
    <TurnkeyContext.Provider
      value={{
        client,
        login,
        completeLogin,
        updateUser,
        clearError,
        error,
        loading,
        user,
      }}
    >
      {children}
    </TurnkeyContext.Provider>
  );
};
