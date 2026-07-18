import { colorScheme } from "nativewind";

import type { ThemePreference } from "@/lib/theme-preference";

// Tailwind's darkMode: "class" selector; NativeWind toggles the same class.
const DARK_CLASS = "dark";

// Web-only quirk this module owns: with the class strategy, NativeWind's
// colorScheme.set() only adds the dark class for an explicit "dark" —
// "system" hits the remove branch and nothing maps the OS preference back
// onto the class (react-native-css-interop web/color-scheme.js), so dark:
// styles would render light while the OS is dark.
const media =
  process.env.EXPO_OS === "web" && typeof document !== "undefined"
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

let preference: ThemePreference = "system";

export function shouldUseDarkClass(
  value: ThemePreference,
  systemPrefersDark: boolean,
) {
  return value === "dark" || (value === "system" && systemPrefersDark);
}

function syncDarkClass() {
  if (!media) return;
  document.documentElement.classList.toggle(
    DARK_CLASS,
    shouldUseDarkClass(preference, media.matches),
  );
}

// Keep the class in step when the OS scheme changes while on "system".
media?.addEventListener("change", syncDarkClass);
// First paint: applyColorScheme has not run yet but the OS may be dark.
syncDarkClass();

export function applyColorScheme(value: ThemePreference) {
  preference = value;
  colorScheme.set(value);
  syncDarkClass();
}
