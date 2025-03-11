import "~/global.css";
import { DefaultTheme, Theme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { NAV_THEME } from "~/lib/constants";
import { Providers } from "~/providers";
import { Header } from "~/components/header";
import { PortalHost } from "@rn-primitives/portal";

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

export default function RootLayout() {
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
          <Stack.Screen
            name="import-wallet"
            options={{
              title: "Import Wallet",
            }}
          />
        </Stack>
        <StatusBar backgroundColor="transparent" />
        <PortalHost />
      </ThemeProvider>
    </Providers>
  );
}
