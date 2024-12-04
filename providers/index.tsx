import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SessionProvider } from './session';
import { TurnkeyProvider } from './turnkey';
import React from 'react';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <SessionProvider>
          <TurnkeyProvider>{children}</TurnkeyProvider>
        </SessionProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};
