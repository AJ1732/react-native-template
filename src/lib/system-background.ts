import * as SystemUI from "expo-system-ui";
import { Appearance } from "react-native";

import { shouldUseDarkClass } from "@/lib/color-scheme";
import { canvasColor } from "@/lib/theme";
import { themePreferenceStore } from "@/lib/theme-preference";

// Android draws its system bars transparent (edge-to-edge), so the area behind
// the status and gesture-navigation bars shows the native window background,
// which defaults to white regardless of the app theme. Paint that window with
// the app canvas so it stays continuous with the UI in every scheme.
//
// Driven imperatively off the preference store and OS appearance rather than a
// React effect: the same external-subscription pattern color-scheme.ts uses for
// the web dark class, and it lets the window match before the splash hides.

const isNative = process.env.EXPO_OS !== "web";

export function syncWindowBackground() {
  if (!isNative) return;
  const dark = shouldUseDarkClass(
    themePreferenceStore.getSnapshot(),
    Appearance.getColorScheme() === "dark",
  );
  // Best-effort: a failed native call must never crash the app.
  SystemUI.setBackgroundColorAsync(
    dark ? canvasColor.dark : canvasColor.light,
  ).catch(() => {});
}

export function startWindowBackgroundSync() {
  if (!isNative) return () => {};
  const unsubscribe = themePreferenceStore.subscribe(syncWindowBackground);
  const listener = Appearance.addChangeListener(syncWindowBackground);
  syncWindowBackground();
  return () => {
    unsubscribe();
    listener.remove();
  };
}

startWindowBackgroundSync();
