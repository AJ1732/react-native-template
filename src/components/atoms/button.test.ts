import { describe, expect, it } from "vitest";

import { brand } from "@/lib/colors";

import { buttonContentColor, type ButtonVariant } from "./button.styles";

const FOREGROUND = "#171717";

describe("buttonContentColor", () => {
  it("returns white for solid-fill variants", () => {
    const opts = { foreground: FOREGROUND, isDark: false };
    expect(buttonContentColor("primary", opts)).toBe("#ffffff");
    expect(buttonContentColor("destructive", opts)).toBe("#ffffff");
  });

  it("tracks the brand text step per scheme for secondary", () => {
    expect(
      buttonContentColor("secondary", {
        foreground: FOREGROUND,
        isDark: false,
      }),
    ).toBe(brand[600]);
    expect(
      buttonContentColor("secondary", { foreground: FOREGROUND, isDark: true }),
    ).toBe(brand[300]);
  });

  it("uses the passed foreground for text-foreground variants", () => {
    const opts = { foreground: FOREGROUND, isDark: false };
    expect(buttonContentColor("outline", opts)).toBe(FOREGROUND);
    expect(buttonContentColor("ghost", opts)).toBe(FOREGROUND);
  });

  it("declares a non-empty tint for every variant", () => {
    const variants: ButtonVariant[] = [
      "primary",
      "secondary",
      "outline",
      "ghost",
      "destructive",
    ];
    for (const variant of variants) {
      expect(
        buttonContentColor(variant, { foreground: FOREGROUND, isDark: false }),
      ).toMatch(/^#[0-9a-f]{3,6}$/i);
    }
  });
});
