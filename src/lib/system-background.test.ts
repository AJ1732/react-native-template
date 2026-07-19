import { beforeEach, describe, expect, it, vi } from "vitest";

// shouldUseDarkClass (imported by the module under test) pulls in nativewind,
// which does not load in node; only its colorScheme.set is touched.
vi.mock("nativewind", () => ({ colorScheme: { set: vi.fn() } }));

const setBackgroundColorAsync = vi.fn(() => Promise.resolve());
vi.mock("expo-system-ui", () => ({ setBackgroundColorAsync }));

const getColorScheme = vi.fn<() => "light" | "dark" | null>(() => "dark");
const addChangeListener = vi.fn(() => ({ remove: vi.fn() }));
vi.mock("react-native", () => ({
  Appearance: { getColorScheme, addChangeListener },
}));

const getSnapshot = vi.fn<() => "system" | "light" | "dark">(() => "system");
const subscribe = vi.fn(() => vi.fn());
vi.mock("@/lib/theme-preference", () => ({
  themePreferenceStore: { getSnapshot, subscribe },
}));

vi.mock("@/lib/theme", () => ({
  canvasColor: { light: "#ffffff", dark: "#0a0a0a" },
}));

// Importing the module runs startWindowBackgroundSync() once as a side effect.
const { syncWindowBackground, startWindowBackgroundSync } =
  await import("@/lib/system-background");

describe("syncWindowBackground", () => {
  beforeEach(() => {
    setBackgroundColorAsync.mockClear();
    getSnapshot.mockReturnValue("system");
  });

  it("paints the OS canvas when the preference is system", () => {
    getColorScheme.mockReturnValue("dark");
    syncWindowBackground();
    expect(setBackgroundColorAsync).toHaveBeenCalledWith("#0a0a0a");

    getColorScheme.mockReturnValue("light");
    syncWindowBackground();
    expect(setBackgroundColorAsync).toHaveBeenLastCalledWith("#ffffff");
  });

  it("an explicit preference ignores the OS scheme", () => {
    getSnapshot.mockReturnValue("dark");
    getColorScheme.mockReturnValue("light");
    syncWindowBackground();
    expect(setBackgroundColorAsync).toHaveBeenCalledWith("#0a0a0a");
  });

  it("swallows a failing native call", async () => {
    setBackgroundColorAsync.mockRejectedValueOnce(new Error("no window"));
    const unhandled = vi.fn();
    process.on("unhandledRejection", unhandled);

    syncWindowBackground();
    await new Promise((resolve) => setImmediate(resolve));

    process.off("unhandledRejection", unhandled);
    expect(unhandled).not.toHaveBeenCalled();
  });
});

describe("startWindowBackgroundSync", () => {
  it("subscribes to the store and the OS, and paints once", () => {
    subscribe.mockClear();
    addChangeListener.mockClear();
    setBackgroundColorAsync.mockClear();

    startWindowBackgroundSync();

    expect(subscribe).toHaveBeenCalledOnce();
    expect(addChangeListener).toHaveBeenCalledOnce();
    expect(setBackgroundColorAsync).toHaveBeenCalledOnce();
  });
});
