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
import { LoginMethod, User } from '~/lib/types';
import { getAddress } from 'viem';
import { toast } from 'sonner-native';

export interface TurnkeyClientType {
  client: TurnkeyClient | undefined;
  login: LoginFunction;
  completeLogin: CompleteLoginFunction;
  logout: () => Promise<void>;
  updateUser: ({
    email,
    phone,
  }: {
    email?: string;
    phone?: string;
  }) => Promise<void>;
  clearError: () => void;
  error: string | undefined;
  loading: LoginMethod | undefined;
  user: User | undefined;
}

export const TurnkeyContext = createContext<TurnkeyClientType>({
  client: undefined,
  login: async () => Promise.resolve(),
  logout: async () => Promise.resolve(),
  completeLogin: async () => Promise.resolve(),
  updateUser: async () => Promise.resolve(),
  clearError: () => {},
  error: undefined,
  loading: undefined,
  user: undefined,
});

interface TurnkeyProviderProps {
  children: ReactNode;
}

// Define the overloads as a type
type LoginFunction = {
  (
    method: LoginMethod.OtpAuth,
    params: {
      otpType: 'OTP_TYPE_EMAIL' | 'OTP_TYPE_SMS';
      contact: string;
    }
  ): Promise<void>;
  (method: LoginMethod.Passkey, params: { email?: string }): Promise<void>;
  (method: LoginMethod.Email, params: {}): Promise<void>;
};

type CompleteLoginFunction = {
  (
    method: LoginMethod.OtpAuth,
    params: { otpId?: string; otpCode: string }
  ): Promise<void>;
};

export const TurnkeyProvider: React.FC<TurnkeyProviderProps> = ({
  children,
}) => {
  const [client, setClient] = useState<TurnkeyClient | undefined>(undefined);
  const router = useRouter();
  const { createEmbeddedKey, createSession, session, clearSession } =
    useSession();
  // TODO: Refactor to useReducer, and set otpId for action INIT_OTP_AUTH
  const [otpId, setOtpId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<LoginMethod | undefined>(undefined);
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

      // ID isn't visible by users, but needs to be random enough and valid base64 (for Android)
      const userId = Buffer.from(String(Date.now())).toString('base64');

      const authenticatorParams = await createPasskey({
        // This doesn't matter much, it will be the name of the authenticator persisted on the Turnkey side.
        // Won't be visible by default.
        authenticatorName: 'End-User Passkey',
        rp: {
          id: 'react-native-demo-wallet.vercel.app',
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
    }
    return Promise.resolve();
  };

  const completeLogin: CompleteLoginFunction = async (method, params) => {
    console.log('completeLogin', method, params);
    setLoading(method);
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
      setLoading(undefined);
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
      console.log('Updating user', {
        type: 'ACTIVITY_TYPE_UPDATE_USER',
        timestampMs: Date.now().toString(),
        organizationId: user.organizationId,
        parameters,
      });
      const result = await client.updateUser({
        type: 'ACTIVITY_TYPE_UPDATE_USER',
        timestampMs: Date.now().toString(),
        organizationId: user.organizationId,
        parameters,
      });
      console.log('Update user result', result);
      toast.success('Info saved 🎉');
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const clearError = () => {
    setError(undefined);
  };

  const logout = async () => {
    await clearSession();
    router.replace('/');
  };

  return (
    <TurnkeyContext.Provider
      value={{
        client,
        login,
        logout,
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
