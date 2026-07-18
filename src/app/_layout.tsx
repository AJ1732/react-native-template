import "./global.css";

import { type FontSource, useFonts } from "expo-font";
import { type ErrorBoundaryProps, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Button } from "@/components/atoms/button";
import { Text } from "@/components/atoms/text";
import { useIsSignedIn } from "@/lib/auth";
import { darkTheme, lightTheme } from "@/lib/theme";
import { useThemeHydrated } from "@/lib/theme-preference";

// Keep the splash visible until the stored theme preference is applied, so
// the first frame paints in the right scheme; expo-router's auto-hide defers
// to this user-level call. Web has no splash and its static export must
// render content, so it is not gated.
if (process.env.EXPO_OS !== "web") {
  SplashScreen.preventAutoHideAsync();
}

// Route errors replace the whole tree, so the fallback must apply the theme
// vars itself instead of relying on RootLayout's wrapper.
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const { colorScheme } = useColorScheme();

  return (
    <View
      style={colorScheme === "dark" ? darkTheme : lightTheme}
      className="flex-1 items-center justify-center gap-4 bg-canvas p-6"
    >
      <Text size="lg">Something went wrong</Text>
      <Text variant="muted" className="text-center">
        {error.message}
      </Text>
      <Button label="Try again" onPress={retry} className="self-center" />
    </View>
  );
}

// The expo-font config plugin embeds fonts in native builds only; the
// browser needs a runtime @font-face registration.
const webFonts: Record<string, FontSource> =
  process.env.EXPO_OS === "web"
    ? { InterVariable: require("../../assets/fonts/InterVariable.ttf") }
    : {};

export default function RootLayout() {
  useFonts(webFonts);
  const isSignedIn = useIsSignedIn();
  const hydrated = useThemeHydrated();
  const { colorScheme } = useColorScheme();

  if (process.env.EXPO_OS !== "web" && !hydrated) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={colorScheme === "dark" ? darkTheme : lightTheme}
        className="flex-1 bg-canvas"
        onLayout={() => {
          SplashScreen.hideAsync();
        }}
      >
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "none",
            contentStyle: { backgroundColor: "transparent" },
          }}
        >
          <Stack.Protected guard={!isSignedIn}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
          <Stack.Protected guard={isSignedIn}>
            <Stack.Screen name="(tabs)" />
          </Stack.Protected>
        </Stack>
      </View>
    </GestureHandlerRootView>
  );
}
