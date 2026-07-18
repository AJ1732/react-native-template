import { describe, expect, it, vi } from "vitest";

import { createMemoryStorage, type KeyValueStorage } from "@/lib/storage";
import {
  createThemePreferenceStore,
  THEME_STORAGE_KEY,
} from "@/lib/theme-preference";

// Importing the module instantiates the app singleton, which wires
// AsyncStorage and NativeWind; neither loads in the node test environment.
// The factory under test receives explicit fakes instead.
vi.mock("@/lib/app-storage", async () => {
  const { createMemoryStorage } = await import("@/lib/storage");
  return { appStorage: createMemoryStorage() };
});
vi.mock("nativewind", () => ({ colorScheme: { set: () => {} } }));

async function createStore(initial: Record<string, string> = {}) {
  const storage = createMemoryStorage(initial);
  const apply = vi.fn();
  const store = createThemePreferenceStore(storage, apply);
  await store.hydration;
  return { store, storage, apply };
}

describe("theme preference store", () => {
  it("defaults to system when nothing is stored", async () => {
    const { store, apply } = await createStore();

    expect(store.getSnapshot()).toBe("system");
    expect(store.isHydrated()).toBe(true);
    expect(apply).not.toHaveBeenCalled();
  });

  it("applies a stored override on hydration", async () => {
    const { store, apply } = await createStore({
      [THEME_STORAGE_KEY]: "dark",
    });

    expect(store.getSnapshot()).toBe("dark");
    expect(apply).toHaveBeenCalledWith("dark");
  });

  it("ignores corrupt stored values", async () => {
    const { store, apply } = await createStore({
      [THEME_STORAGE_KEY]: "banana",
    });

    expect(store.getSnapshot()).toBe("system");
    expect(apply).not.toHaveBeenCalled();
  });

  it("falls back to system when the storage read fails", async () => {
    const failing: KeyValueStorage = {
      get: () => Promise.reject(new Error("storage unavailable")),
      set: () => Promise.resolve(),
      remove: () => Promise.resolve(),
    };
    const store = createThemePreferenceStore(failing, vi.fn());
    await store.hydration;

    expect(store.getSnapshot()).toBe("system");
    expect(store.isHydrated()).toBe(true);
  });

  it("set applies, persists, and notifies", async () => {
    const { store, storage, apply } = await createStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    store.set("dark");

    expect(store.getSnapshot()).toBe("dark");
    expect(apply).toHaveBeenCalledWith("dark");
    expect(listener).toHaveBeenCalledTimes(1);
    expect(await storage.get(THEME_STORAGE_KEY)).toBe("dark");
    unsubscribe();
  });

  it("does not notify or persist when the value is unchanged", async () => {
    const { store, storage } = await createStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    store.set("system");

    expect(listener).not.toHaveBeenCalled();
    expect(await storage.get(THEME_STORAGE_KEY)).toBeNull();
    unsubscribe();
  });

  it("survives a failing write and still applies in-session", async () => {
    const failing: KeyValueStorage = {
      get: () => Promise.resolve(null),
      set: () => Promise.reject(new Error("storage full")),
      remove: () => Promise.resolve(),
    };
    const unhandled = vi.fn();
    process.on("unhandledRejection", unhandled);

    const store = createThemePreferenceStore(failing, vi.fn());
    await store.hydration;
    store.set("dark");
    await new Promise((resolve) => setImmediate(resolve));
    await new Promise((resolve) => setImmediate(resolve));

    process.off("unhandledRejection", unhandled);
    expect(store.getSnapshot()).toBe("dark");
    expect(unhandled).not.toHaveBeenCalled();
  });

  it("late hydration does not override an explicit user choice", async () => {
    let resolveRead: (value: string | null) => void = () => {};
    const slow: KeyValueStorage = {
      get: () =>
        new Promise((resolve) => {
          resolveRead = resolve;
        }),
      set: () => Promise.resolve(),
      remove: () => Promise.resolve(),
    };
    const store = createThemePreferenceStore(slow, vi.fn());

    expect(store.isHydrated()).toBe(false);
    store.set("dark");
    resolveRead("light");
    await store.hydration;

    expect(store.getSnapshot()).toBe("dark");
    expect(store.isHydrated()).toBe(true);
  });
});
