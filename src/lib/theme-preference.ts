import { useSyncExternalStore } from "react";

import { appStorage } from "@/lib/app-storage";
import { applyColorScheme } from "@/lib/color-scheme";
import type { KeyValueStorage } from "@/lib/storage";

export const THEME_PREFERENCES = ["system", "light", "dark"] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export const THEME_STORAGE_KEY = "theme-preference";

function isThemePreference(value: unknown): value is ThemePreference {
  return THEME_PREFERENCES.includes(value as ThemePreference);
}

// Same useSyncExternalStore pattern as auth.ts, but built as a factory: the
// storage backend and the scheme applier (NativeWind) are injected, so the
// store logic stays dependency-free and testable.
export function createThemePreferenceStore(
  storage: KeyValueStorage,
  applyScheme: (value: ThemePreference) => void,
) {
  let preference: ThemePreference = "system";
  let hydrated = false;
  // An explicit user choice wins over hydration resolving late.
  let touched = false;
  const listeners = new Set<() => void>();

  const notify = () => listeners.forEach((listener) => listener());

  // Hydration starts on creation; missing, corrupt, or unreadable values
  // fall back to "system".
  const hydration = storage
    .get(THEME_STORAGE_KEY)
    .then((stored) => {
      if (!touched && isThemePreference(stored)) {
        preference = stored;
        applyScheme(stored);
      }
    })
    .catch(() => {})
    .finally(() => {
      hydrated = true;
      notify();
    });

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => preference,
    isHydrated: () => hydrated,
    hydration,
    set(value: ThemePreference) {
      touched = true;
      if (preference === value) return;
      preference = value;
      applyScheme(value);
      notify();
      // Persistence is best-effort; the in-session preference already applies.
      storage.set(THEME_STORAGE_KEY, value).catch(() => {});
    },
  };
}

export type ThemePreferenceStore = ReturnType<
  typeof createThemePreferenceStore
>;

// App-wide singleton; hydration kicks off at module load, and the root
// layout holds the splash screen on native until it lands.
export const themePreferenceStore = createThemePreferenceStore(
  appStorage,
  applyColorScheme,
);

export function setThemePreference(value: ThemePreference) {
  themePreferenceStore.set(value);
}

export function useThemePreference() {
  return useSyncExternalStore(
    themePreferenceStore.subscribe,
    themePreferenceStore.getSnapshot,
    themePreferenceStore.getSnapshot,
  );
}

export function useThemeHydrated() {
  return useSyncExternalStore(
    themePreferenceStore.subscribe,
    themePreferenceStore.isHydrated,
    themePreferenceStore.isHydrated,
  );
}
