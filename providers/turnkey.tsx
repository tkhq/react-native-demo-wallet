import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { TurnkeyClient } from "@turnkey/http";
import * as turnkeyRPC from "~/lib/turnkey-rpc";
import {
  createPasskey,
  isSupported,
  PasskeyStamper,
} from "@turnkey/react-native-passkey-stamper";
import { useRouter } from "expo-router";
import { useSession } from "~/hooks/use-session";
import { ApiKeyStamper } from "@turnkey/api-key-stamper";
import { Email, LoginMethod, User } from "~/lib/types";
import { getAddress } from "viem";
import { toast } from "sonner-native";
import {
  OTP_AUTH_DEFAULT_EXPIRATION_SECONDS,
  PASSKEY_APP_NAME,
  TURNKEY_API_URL,
  TURNKEY_PARENT_ORG_ID,
  TURNKEY_RP_ID,
} from "~/lib/constants";

type AuthActionType =
  | { type: "PASSKEY"; payload: User }
  | { type: "INIT_EMAIL_AUTH" }
  | { type: "COMPLETE_EMAIL_AUTH"; payload: User }
  | { type: "INIT_PHONE_AUTH" }
  | { type: "COMPLETE_PHONE_AUTH"; payload: User }
  | { type: "EMAIL_RECOVERY"; payload: User }
  | { type: "WALLET_AUTH"; payload: User }
  | { type: "OAUTH"; payload: User }
  | { type: "LOADING"; payload: LoginMethod | null }
  | { type: "ERROR"; payload: string }
  | { type: "CLEAR_ERROR" };
interface AuthState {
  loading: LoginMethod | null;
  error: string;
  user: User | null;
}

const initialState: AuthState = {
  loading: null,
  error: "",
  user: null,
};

function authReducer(state: AuthState, action: AuthActionType): AuthState {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: action.payload ? action.payload : null };
    case "ERROR":
      return { ...state, error: action.payload, loading: null };
    case "CLEAR_ERROR":
      return { ...state, error: "" };
    case "INIT_EMAIL_AUTH":
      return { ...state, loading: null, error: "" };
    case "COMPLETE_EMAIL_AUTH":
      return { ...state, user: action.payload, loading: null, error: "" };
    case "INIT_PHONE_AUTH":
      return { ...state, loading: null, error: "" };
    case "COMPLETE_PHONE_AUTH":
      return { ...state, user: action.payload, loading: null, error: "" };
    case "OAUTH":
    case "PASSKEY":
    case "EMAIL_RECOVERY":
    case "WALLET_AUTH":
    case "OAUTH":
      return { ...state, user: action.payload, loading: null, error: "" };
    default:
      return state;
  }
}

export interface TurnkeyClientType {
  state: AuthState;
  user: User | undefined;
  updateUser: ({
    email,
    phone,
  }: {
    email?: string;
    phone?: string;
  }) => Promise<void>;
  initEmailLogin: (email: Email) => Promise<void>;
  completeEmailAuth: (params: {
    otpId: string;
    otpCode: string;
    organizationId: string;
  }) => Promise<void>;
  initPhoneLogin: (phone: string) => Promise<void>;
  completePhoneAuth: (params: {
    otpId: string;
    otpCode: string;
    organizationId: string;
  }) => Promise<void>;
  signUpWithPasskey: () => Promise<void>;
  loginWithPasskey: () => Promise<void>;
  loginWithOAuth: (params: {
    oidcToken: string;
    providerName: string;
    targetPublicKey: string;
    expirationSeconds: string
  })=> Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const TurnkeyContext = createContext<TurnkeyClientType>({
  state: initialState,
  user: undefined,
  updateUser: async () => Promise.resolve(),
  initEmailLogin: async () => Promise.resolve(),
  completeEmailAuth: async () => Promise.resolve(),
  initPhoneLogin: async () => Promise.resolve(),
  completePhoneAuth: async () => Promise.resolve(),
  signUpWithPasskey: async () => Promise.resolve(),
  loginWithPasskey: async () => Promise.resolve(),
  loginWithOAuth: async () => Promise.resolve(),
  logout: async () => Promise.resolve(),
  clearError: () => {},
});

interface TurnkeyProviderProps {
  children: ReactNode;
}

export const TurnkeyProvider: React.FC<TurnkeyProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [client, setClient] = useState<TurnkeyClient | undefined>(undefined);
  const router = useRouter();
  const { createEmbeddedKey, createSession, session, clearSession } =
    useSession();

  useEffect(() => {
    if (session) {
      (async () => {
        const stamper = new ApiKeyStamper({
          apiPrivateKey: session.privateKey,
          apiPublicKey: session.publicKey.slice(2),
        });
        const client = new TurnkeyClient({ baseUrl: TURNKEY_API_URL }, stamper);
        setClient(client);

        const whoami = await client.getWhoami({
          organizationId: process.env.EXPO_PUBLIC_TURNKEY_ORGANIZATION_ID ?? "",
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
      })();
    }
  }, [session]);

  const initEmailLogin = async (email: Email) => {
    dispatch({ type: "LOADING", payload: LoginMethod.Email });
    try {
      const response = await turnkeyRPC.initOTPAuth({
        otpType: "OTP_TYPE_EMAIL",
        contact: email,
      });

      if (response) {
        dispatch({ type: "INIT_EMAIL_AUTH" });
        router.push(
          `/otp-auth?otpId=${encodeURIComponent(
            response.otpId
          )}&organizationId=${encodeURIComponent(response.organizationId)}`
        );
      }
    } catch (error: any) {
      dispatch({ type: "ERROR", payload: error.message });
    } finally {
      dispatch({ type: "LOADING", payload: null });
    }
  };

  const updateUser = async (userDetails: {
    email?: string;
    phone?: string;
  }) => {
    if (!client || !user) return;

    const parameters: {
      userId: string;
      userTagIds: string[];
      userPhoneNumber?: string;
      userEmail?: string;
    } = {
      userId: user.id,
      userTagIds: [],
    };

    if (userDetails.phone && userDetails.phone.trim()) {
      parameters.userPhoneNumber = userDetails.phone;
    }

    if (userDetails.email && userDetails.email.trim()) {
      parameters.userEmail = userDetails.email;
    }

    try {
      const result = await client.updateUser({
        type: "ACTIVITY_TYPE_UPDATE_USER",
        timestampMs: Date.now().toString(),
        organizationId: user.organizationId,
        parameters,
      });

      toast.success("Info saved 🎉");
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const completeEmailAuth = async ({
    otpId,
    otpCode,
    organizationId,
  }: {
    otpId: string;
    otpCode: string;
    organizationId: string;
  }) => {
    if (otpCode) {
      dispatch({ type: "LOADING", payload: LoginMethod.Email });
      try {
        const targetPublicKey = await createEmbeddedKey();

        const response = await turnkeyRPC.otpAuth({
          otpId: otpId,
          otpCode: otpCode,
          organizationId: organizationId,
          targetPublicKey,
          expirationSeconds: OTP_AUTH_DEFAULT_EXPIRATION_SECONDS.toString(),
          invalidateExisting: false,
        });

        if (response.credentialBundle) {
          await createSession(response.credentialBundle);
          router.push("/dashboard");
        }
      } catch (error: any) {
        dispatch({ type: "ERROR", payload: error.message });
      } finally {
        dispatch({ type: "LOADING", payload: null });
      }
    }
  };

  const initPhoneLogin = async (phone: string) => {
    dispatch({ type: "LOADING", payload: LoginMethod.Phone });
    try {
      const response = await turnkeyRPC.initOTPAuth({
        otpType: "OTP_TYPE_SMS",
        contact: phone,
      });

      if (response) {
        dispatch({ type: "INIT_PHONE_AUTH" });
        router.push(
          `/otp-auth?otpId=${encodeURIComponent(
            response.otpId
          )}&organizationId=${encodeURIComponent(response.organizationId)}`
        );
      }
    } catch (error: any) {
      dispatch({ type: "ERROR", payload: error.message });
    } finally {
      dispatch({ type: "LOADING", payload: null });
    }
  };

  const completePhoneAuth = async ({
    otpId,
    otpCode,
    organizationId,
  }: {
    otpId: string;
    otpCode: string;
    organizationId: string;
  }) => {
    if (otpCode) {
      dispatch({ type: "LOADING", payload: LoginMethod.Phone });
      try {
        const targetPublicKey = await createEmbeddedKey();

        const response = await turnkeyRPC.otpAuth({
          otpId: otpId,
          otpCode: otpCode,
          organizationId: organizationId,
          targetPublicKey,
          expirationSeconds: OTP_AUTH_DEFAULT_EXPIRATION_SECONDS.toString(),
          invalidateExisting: false,
        });

        if (response.credentialBundle) {
          await createSession(response.credentialBundle);
          router.push("/dashboard");
        }
      } catch (error: any) {
        dispatch({ type: "ERROR", payload: error.message });
      } finally {
        dispatch({ type: "LOADING", payload: null });
      }
    }
  };

  // User will be prompted twice for passkey, once for account creation and once for login
  const signUpWithPasskey = async () => {
    if (!isSupported()) {
      throw new Error("Passkeys are not supported on this device");
    }

    dispatch({ type: "LOADING", payload: LoginMethod.Passkey });

    try {
      const authenticatorParams = await createPasskey({
        authenticatorName: "End-User Passkey",
        rp: {
          id: TURNKEY_RP_ID,
          name: PASSKEY_APP_NAME,
        },
        user: {
          id: String(Date.now()),
          // Name and displayName must match
          // This name is visible to the user. This is what's shown in the passkey prompt
          name: "Anonymous User",
          displayName: "Anonymous User",
        },
      });

      const response = await turnkeyRPC.createSubOrg({
        passkey: {
          challenge: authenticatorParams.challenge,
          attestation: authenticatorParams.attestation,
        },
      });

      if (response.subOrganizationId) {
        // Successfully created sub-organization, proceed with the login flow
        const stamper = new PasskeyStamper({
          rpId: TURNKEY_RP_ID,
        });

        const httpClient = new TurnkeyClient(
          { baseUrl: TURNKEY_API_URL },
          stamper
        );

        const targetPublicKey = await createEmbeddedKey();

        const sessionResponse = await httpClient.createReadWriteSession({
          type: "ACTIVITY_TYPE_CREATE_READ_WRITE_SESSION_V2",
          timestampMs: Date.now().toString(),
          organizationId: TURNKEY_PARENT_ORG_ID,
          parameters: {
            targetPublicKey,
          },
        });

        const credentialBundle =
          sessionResponse.activity.result.createReadWriteSessionResultV2
            ?.credentialBundle;

        if (credentialBundle) {
          await createSession(credentialBundle);
          router.push("/dashboard");
        }
      }
    } catch (error: any) {
      dispatch({ type: "ERROR", payload: error.message });
    } finally {
      dispatch({ type: "LOADING", payload: null });
    }
  };

  const loginWithPasskey = async () => {
    if (!isSupported()) {
      throw new Error("Passkeys are not supported on this device");
    }
    dispatch({ type: "LOADING", payload: LoginMethod.Passkey });

    try {
      const stamper = new PasskeyStamper({
        rpId: TURNKEY_RP_ID,
      });

      const httpClient = new TurnkeyClient(
        { baseUrl: TURNKEY_API_URL },
        stamper
      );

      const targetPublicKey = await createEmbeddedKey();

      const sessionResponse = await httpClient.createReadWriteSession({
        type: "ACTIVITY_TYPE_CREATE_READ_WRITE_SESSION_V2",
        timestampMs: Date.now().toString(),
        organizationId: TURNKEY_PARENT_ORG_ID,
        parameters: {
          targetPublicKey,
        },
      });

      const credentialBundle =
        sessionResponse.activity.result.createReadWriteSessionResultV2
          ?.credentialBundle;

      if (credentialBundle) {
        await createSession(credentialBundle);
        router.push("/dashboard");
      }
    } catch (error: any) {
      dispatch({ type: "ERROR", payload: error.message });
    } finally {
      dispatch({ type: "LOADING", payload: null });
    }
  };

  const loginWithOAuth = async ({
    oidcToken,
    providerName,
    targetPublicKey,
    expirationSeconds,
  }: {
    oidcToken: string;
    providerName: string;
    targetPublicKey: string;
    expirationSeconds: string;
  }) => {
    dispatch({ type: "LOADING", payload: LoginMethod.OAuth });
    try {
      const response = await turnkeyRPC.oAuthLogin({
        oidcToken,
        providerName,
        targetPublicKey,
        expirationSeconds,
      });

      if (response.credentialBundle) {
        await createSession(response.credentialBundle);
        router.push("/dashboard");
      }
    } catch (error: any) {
      dispatch({ type: "ERROR", payload: error.message });
    } finally {
      dispatch({ type: "LOADING", payload: null });
    }
  };

  const logout = async () => {
    await clearSession();
    router.replace("/");
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  return (
    <TurnkeyContext.Provider
      value={{
        state,
        user,
        updateUser,
        initEmailLogin,
        completeEmailAuth,
        initPhoneLogin,
        completePhoneAuth,
        signUpWithPasskey,
        loginWithPasskey,
        loginWithOAuth,
        logout,
        clearError,
      }}
    >
      {children}
    </TurnkeyContext.Provider>
  );
};
