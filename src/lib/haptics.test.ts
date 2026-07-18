import * as Haptics from "expo-haptics";
import { describe, expect, it, vi } from "vitest";

import { haptics } from "@/lib/haptics";

// Simulates an unsupported platform (e.g. desktop web): every call rejects.
vi.mock("expo-haptics", () => ({
  impactAsync: vi.fn(() => Promise.reject(new Error("unsupported"))),
  notificationAsync: vi.fn(() => Promise.reject(new Error("unsupported"))),
  selectionAsync: vi.fn(() => Promise.reject(new Error("unsupported"))),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
  NotificationFeedbackType: {
    Success: "success",
    Warning: "warning",
    Error: "error",
  },
}));

describe("haptics", () => {
  it("calls through to expo-haptics", () => {
    haptics.light();
    expect(Haptics.impactAsync).toHaveBeenCalledWith("light");

    haptics.success();
    expect(Haptics.notificationAsync).toHaveBeenCalledWith("success");

    haptics.selection();
    expect(Haptics.selectionAsync).toHaveBeenCalled();
  });

  it("swallows rejections on unsupported platforms", async () => {
    const unhandled = vi.fn();
    process.on("unhandledRejection", unhandled);

    haptics.light();
    haptics.medium();
    haptics.heavy();
    haptics.success();
    haptics.warning();
    haptics.error();
    haptics.selection();

    // Two macrotask turns so Node flushes pending rejection notifications.
    await new Promise((resolve) => setImmediate(resolve));
    await new Promise((resolve) => setImmediate(resolve));

    process.off("unhandledRejection", unhandled);
    expect(unhandled).not.toHaveBeenCalled();
  });
});
