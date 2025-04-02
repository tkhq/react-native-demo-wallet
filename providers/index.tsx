import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TurnkeyProvider } from "@turnkey/sdk-react-native";
import { AuthRelayProvider } from "./auth-provider";
import React from "react";
import { useRouter } from "expo-router";
import { TURNKEY_API_URL, TURNKEY_PARENT_ORG_ID } from "~/lib/constants";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const sessionConfig = {
    apiBaseUrl: TURNKEY_API_URL,
    organizationId: TURNKEY_PARENT_ORG_ID,
    onSessionSelected: () => {
      router.replace("/dashboard");
    },
    onSessionCleared: () => {
      router.push("/");
    },
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <TurnkeyProvider config={sessionConfig}>
          <AuthRelayProvider>{children}</AuthRelayProvider>
        </TurnkeyProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};
