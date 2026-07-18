import { colorScheme } from "nativewind";
import { describe, expect, it, vi } from "vitest";

import { applyColorScheme, shouldUseDarkClass } from "@/lib/color-scheme";

// NativeWind does not load in the node test environment; the DOM sync is a
// no-op here (no document), so the class decision is tested as pure logic.
vi.mock("nativewind", () => ({ colorScheme: { set: vi.fn() } }));

describe("shouldUseDarkClass", () => {
  it("dark always uses the class", () => {
    expect(shouldUseDarkClass("dark", true)).toBe(true);
    expect(shouldUseDarkClass("dark", false)).toBe(true);
  });

  it("light never uses the class", () => {
    expect(shouldUseDarkClass("light", true)).toBe(false);
    expect(shouldUseDarkClass("light", false)).toBe(false);
  });

  it("system follows the OS", () => {
    expect(shouldUseDarkClass("system", true)).toBe(true);
    expect(shouldUseDarkClass("system", false)).toBe(false);
  });
});

describe("applyColorScheme", () => {
  it("forwards the preference to NativeWind", () => {
    applyColorScheme("dark");
    expect(colorScheme.set).toHaveBeenCalledWith("dark");

    applyColorScheme("system");
    expect(colorScheme.set).toHaveBeenCalledWith("system");
  });
});
