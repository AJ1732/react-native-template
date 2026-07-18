import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges conflicting tailwind classes, last wins", () => {
    expect(cn("px-4", "px-2")).toBe("px-2");
  });

  it("lets callers override baked alignment (Button self-start pattern)", () => {
    expect(cn("self-start", "self-center")).toBe("self-center");
  });

  it("drops falsy conditional values", () => {
    expect(cn("base", false && "hidden", undefined, null)).toBe("base");
  });

  it("keeps unrelated classes intact", () => {
    expect(cn("flex-row items-center", "gap-2")).toBe(
      "flex-row items-center gap-2",
    );
  });
});
