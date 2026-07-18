import { describe, expect, it } from "vitest";

import { brand, brandColor, neutral } from "@/lib/colors";

const HEX = /^#[0-9a-f]{6}$/;
const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

describe("color constants", () => {
  it("brandColor is the brand-500 step", () => {
    expect(brandColor).toBe(brand[500]);
  });

  it("brand scale has all standard steps as valid hex", () => {
    expect(
      Object.keys(brand)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(SCALE_STEPS);
    for (const value of Object.values(brand)) {
      expect(value).toMatch(HEX);
    }
  });

  it("neutral scale has all standard steps as valid hex", () => {
    expect(
      Object.keys(neutral)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(SCALE_STEPS);
    for (const value of Object.values(neutral)) {
      expect(value).toMatch(HEX);
    }
  });
});
