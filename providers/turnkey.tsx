import {
  ReactNode,
  createContext,
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
import { OTP_AUTH_DEFAULT_EXPIRATION_SECONDS, TURNKEY_API_URL, TURNKEY_PARENT_ORG_ID, TURNKEY_RP_ID } from "~/lib/constants";



type AuthActionType =
  | { type: "PASSKEY"; payload: User }
  | { type: "INIT_EMAIL_AUTH" }
  | { type: "COMPLETE_EMAIL_AUTH"; payload: User }
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
  initEmailLogin: (email: Email) => Promise<void>;
  completeEmailAuth: (params: {
    otpId: string;
    otpCode: string;
    organizationId: string;
  }) => Promise<void>;
  loginWithPasskey: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const TurnkeyContext = createContext<TurnkeyClientType>({
  state: initialState,
  initEmailLogin: async () => Promise.resolve(),
  completeEmailAuth: async () => Promise.resolve(),
  loginWithPasskey: async () => Promise.resolve(),
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
  const router = useRouter();
  const { createEmbeddedKey, createSession, session, clearSession } =
    useSession();

  const initEmailLogin = async (email: Email) => {
    dispatch({ type: "LOADING", payload: LoginMethod.Email });
    try {
      const response = await turnkeyRPC.initOTPAuth({
        otpType: "OTP_TYPE_EMAIL",
        contact: email,
      });

      if (response) {
        dispatch({ type: "INIT_EMAIL_AUTH" });
        router.push(`/otp-auth?otpId=${encodeURIComponent(response.otpId)}&organizationId=${encodeURIComponent(response.organizationId)}`);
      }
    } catch (error: any) {
      dispatch({ type: "ERROR", payload: error.message });
    } finally {
      dispatch({ type: "LOADING", payload: null });
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

        const result = await turnkeyRPC.otpAuth({
          otpId: otpId,
          otpCode: otpCode,
          organizationId: organizationId,
          targetPublicKey,
          expirationSeconds: OTP_AUTH_DEFAULT_EXPIRATION_SECONDS.toString(),
          invalidateExisting: false,
        });

        if (result.credentialBundle) {
          await createSession(result.credentialBundle);
          router.push("/dashboard");
        }
      } catch (error: any) {
        dispatch({ type: "ERROR", payload: error.message });
      } finally {
        dispatch({ type: "LOADING", payload: null });
      }
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
      router.push("/dashboard");
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
        initEmailLogin,
        completeEmailAuth,
        loginWithPasskey,
        logout,
        clearError,
      }}
    >
      {children}
    </TurnkeyContext.Provider>
  );
};
