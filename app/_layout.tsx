import "~/global.css";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import {
  Inter_900Black,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_300Light,
  useFonts,
} from "@expo-google-fonts/inter";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { Providers } from "~/providers";
import { Toaster } from "sonner-native";
import { Text } from "~/components/ui/text";

import { Header } from "~/components/header";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      ...DefaultTheme.fonts.regular,
      fontFamily: "Inter_400Regular",
    },
    medium: {
      ...DefaultTheme.fonts.medium,
      fontFamily: "Inter_500Medium",
    },
    bold: {
      ...DefaultTheme.fonts.bold,
      fontFamily: "Inter_700Bold",
      fontWeight: "700",
    },
    heavy: {
      ...DefaultTheme.fonts.heavy,
      fontFamily: "Inter_800ExtraBold",
    },
  },
};

const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  // Load fonts
  const [loaded, error] = useFonts({
    Inter_900Black,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_300Light,
  });

  React.useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (Platform.OS === "web") {
        document.documentElement.classList.add("bg-background");
      }
      if (!theme) {
        AsyncStorage.setItem("theme", "light");
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      if (colorTheme !== colorScheme) {
        setColorScheme("light");
        setAndroidNavigationBar("light");
        setIsColorSchemeLoaded(true);
        return;
      }
      setAndroidNavigationBar("light");
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      if (loaded || error) {
        SplashScreen.hideAsync();
      }
    });
  }, [loaded, error]);

  if (!isColorSchemeLoaded || (!loaded && !error)) {
    return null;
  }

  return (
    <Providers>
      <ThemeProvider value={LIGHT_THEME}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="dashboard"
            options={{
              header: () => <Header />,
              title: "",
            }}
          />
          <Stack.Screen
            name="import-wallet"
            options={{
              title: "Import Wallet",
            }}
          />
          <Stack.Screen
            name="otp-auth"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: "Settings",
            }}
          />
        </Stack>
        <StatusBar backgroundColor="transparent" />
        <PortalHost />
        <Toaster
          position="top-center"
          // offset={100}
          duration={3000}
          swipeToDismissDirection="up"
          visibleToasts={4}
          closeButton
          autoWiggleOnUpdate="toast-change"
          theme="light"
          toastOptions={{
            actionButtonStyle: {
              paddingHorizontal: 20,
            },
          }}
          pauseWhenPageIsHidden
        />
      </ThemeProvider>
    </Providers>
  );
}
