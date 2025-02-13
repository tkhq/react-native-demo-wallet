import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SessionProvider } from '@turnkey/react-native-sessions';
import { TurnkeyProvider } from './turnkey';
import React from 'react';
import { useRouter } from 'expo-router';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const sessionConfig = {
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
        <SessionProvider config={sessionConfig}>
          <TurnkeyProvider>{children}</TurnkeyProvider>
        </SessionProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};