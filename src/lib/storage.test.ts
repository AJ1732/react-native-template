import { describe, expect, it } from "vitest";

import { createMemoryStorage } from "@/lib/storage";

describe("createMemoryStorage", () => {
  it("returns null for a missing key", async () => {
    const storage = createMemoryStorage();
    expect(await storage.get("missing")).toBeNull();
  });

  it("round-trips set and get", async () => {
    const storage = createMemoryStorage();
    await storage.set("key", "value");
    expect(await storage.get("key")).toBe("value");
  });

  it("removes keys", async () => {
    const storage = createMemoryStorage({ key: "value" });
    await storage.remove("key");
    expect(await storage.get("key")).toBeNull();
  });

  it("seeds from initial values", async () => {
    const storage = createMemoryStorage({ key: "seeded" });
    expect(await storage.get("key")).toBe("seeded");
  });

  it("instances do not share state", async () => {
    const a = createMemoryStorage();
    const b = createMemoryStorage();
    await a.set("key", "a");
    expect(await b.get("key")).toBeNull();
  });
});
