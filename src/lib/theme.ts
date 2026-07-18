import { useColorScheme, vars } from "nativewind";

import { brand, brandColor, neutral } from "@/lib/colors";

export { brandColor };

const semanticColors = {
  light: {
    canvas: "#ffffff",
    surface: neutral[50],
    subtle: neutral[100],
    foreground: neutral[900],
    "foreground-muted": neutral[500],
    outline: neutral[200],
    "outline-subtle": neutral[100],
    "outline-strong": neutral[300],
    danger: "#dc2626",
  },
  dark: {
    canvas: neutral[950],
    surface: neutral[900],
    subtle: neutral[800],
    foreground: neutral[50],
    "foreground-muted": neutral[400],
    outline: neutral[700],
    "outline-subtle": neutral[800],
    "outline-strong": neutral[600],
    danger: "#ef4444",
  },
} as const;

function rgbChannels(hex: string) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

function toThemeVars(colors: Record<string, string>) {
  return vars(
    Object.fromEntries(
      Object.entries(colors).map(([name, hex]) => [
        `--${name}`,
        rgbChannels(hex),
      ]),
    ),
  );
}

export const lightTheme = toThemeVars(semanticColors.light);
export const darkTheme = toThemeVars(semanticColors.dark);

// Accents that have no CSS-var counterpart (icon strokes, nav tints).
const accentColors = {
  light: {
    icon: neutral[800],
    iconMuted: neutral[500],
    chevron: neutral[900],
    tint: neutral[600],
  },
  dark: {
    icon: neutral[300],
    iconMuted: neutral[400],
    chevron: neutral[100],
    tint: neutral[400],
  },
} as const;

export type ThemeColors = Record<
  | keyof (typeof semanticColors)["light"]
  | keyof (typeof accentColors)["light"]
  | "brand",
  string
>;

// JS values for native components (tab bars, navigators, interpolateColor)
// that can't read the CSS vars applied in the root layout.
export function useThemeColors(): ThemeColors {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === "dark" ? "dark" : "light";
  return {
    ...semanticColors[scheme],
    ...accentColors[scheme],
    // Thin strokes and text in saturated brand-500 fringe on dark
    // backgrounds; the lighter 400 step reads crisp. Fills stay 500.
    brand: scheme === "dark" ? brand[400] : brandColor,
  };
}
