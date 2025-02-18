import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TurnkeyProvider } from '@turnkey/sdk-react-native';
import { AuthRelayProvider } from './turnkey';
import React from 'react';
import { useRouter } from 'expo-router';
import { TURNKEY_API_URL } from '~/lib/constants';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const sessionConfig = {
    apiBaseUrl: TURNKEY_API_URL,
    onSessionCreated: () => {
      router.replace("/dashboard");
    },
    onSessionExpired: () => {
      router.push("/");
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