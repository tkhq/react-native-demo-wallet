'use client';

import { createContext, ReactNode, useReducer } from 'react';

import { useRouter } from 'expo-router';
import { Email } from '~/lib/types';

type AuthActionType =
  | { type: 'LOADING'; payload: boolean }
  | { type: 'ERROR'; payload: string };

interface AuthState {
  loading: boolean;
  error: string;
}

const initialState: AuthState = {
  loading: false,
  error: '',
};

function authReducer(state: AuthState, action: AuthActionType): AuthState {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: action.payload };
    case 'ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export const AuthContext = createContext<{
  state: AuthState;
  initOTPAuth: (email: Email) => Promise<void>;
  loginWithPasskey: (email?: Email) => Promise<void>;
  logout: () => Promise<void>;
}>({
  state: initialState,
  initOTPAuth: async () => {},
  loginWithPasskey: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  const initOTPAuth = async (email: Email) => {
    dispatch({ type: 'LOADING', payload: true });
    try {
      // const response = await initEmailAuth({
      //   email,
      //   targetPublicKey: `${authIframeClient?.iframePublicKey}`,
      // });
      // if (response) {
      //   // router.push(`/email-auth?userEmail=${encodeURIComponent(email)}`);
      // }
    } catch (error: any) {
      dispatch({ type: 'ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'LOADING', payload: false });
    }
  };

  const completeEmailAuth = async ({
    userEmail,
    continueWith,
    credentialBundle,
  }: {
    userEmail: string;
    continueWith: string;
    credentialBundle: string;
  }) => {
    // if (userEmail && continueWith === 'email' && credentialBundle) {
    //   dispatch({ type: 'LOADING', payload: true });
    //   try {
    //     await authIframeClient?.injectCredentialBundle(credentialBundle);
    //     if (authIframeClient?.iframePublicKey) {
    //       const loginResponse =
    //         await authIframeClient?.loginWithReadWriteSession(
    //           authIframeClient.iframePublicKey
    //         );
    //       if (loginResponse?.organizationId) {
    //         router.push('/dashboard');
    //       }
    //     }
    //   } catch (error: any) {
    //     dispatch({ type: 'ERROR', payload: error.message });
    //   } finally {
    //     dispatch({ type: 'LOADING', payload: false });
    //   }
    // }
  };

  const loginWithPasskey = async (email?: Email) => {
    // dispatch({ type: 'LOADING', payload: true });
    // try {
    //   // const subOrgId = await getSubOrgIdByEmail(email as Email);
    //   if (subOrgId?.length) {
    //     const loginResponse = await passkeyClient?.login();
    //     if (loginResponse?.organizationId) {
    //       router.push('/dashboard');
    //     }
    //   } else {
    //     // User either does not have an account with a sub organization
    //     // or does not have a passkey
    //     // Create a new passkey for the user
    //     const { encodedChallenge, attestation } =
    //       (await passkeyClient?.createUserPasskey({
    //         publicKey: {
    //           user: {
    //             name: email,
    //             displayName: email,
    //           },
    //         },
    //       })) || {};
    //     // Create a new sub organization for the user
    //     if (encodedChallenge && attestation) {
    //       const { subOrg, user } = await createUserSubOrg({
    //         email: email as Email,
    //         passkey: {
    //           challenge: encodedChallenge,
    //           attestation,
    //         },
    //       });
    //       if (subOrg && user) {
    //         router.push('/dashboard');
    //       }
    //     }
    //   }
    // } catch (error: any) {
    //   dispatch({ type: 'ERROR', payload: error.message });
    // } finally {
    //   dispatch({ type: 'LOADING', payload: false });
    // }
  };

  const logout = async () => {
    // await turnkey?.logoutUser();

    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        initOTPAuth,
        loginWithPasskey,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
