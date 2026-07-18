import { beforeEach, describe, expect, it, vi } from "vitest";

import { authStore, signIn, signOut } from "@/lib/auth";

describe("auth store", () => {
  beforeEach(() => {
    signOut();
  });

  it("starts signed out", () => {
    expect(authStore.getSnapshot()).toBe(false);
  });

  it("signIn flips the snapshot and notifies subscribers", () => {
    const listener = vi.fn();
    const unsubscribe = authStore.subscribe(listener);

    signIn();

    expect(authStore.getSnapshot()).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it("does not notify when the value is unchanged", () => {
    signIn();
    const listener = vi.fn();
    const unsubscribe = authStore.subscribe(listener);

    signIn();

    expect(listener).not.toHaveBeenCalled();
    unsubscribe();
  });

  it("unsubscribed listeners stop receiving updates", () => {
    const listener = vi.fn();
    const unsubscribe = authStore.subscribe(listener);
    unsubscribe();

    signIn();

    expect(listener).not.toHaveBeenCalled();
  });
});
