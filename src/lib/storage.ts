// Storage contract app code depends on. Backends (AsyncStorage, SecureStore,
// in-memory) implement this, so consumers never import a storage library
// directly and the backend can be swapped per concern.
export type KeyValueStorage = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
};

// Dependency-free backend for tests and ephemeral state.
export function createMemoryStorage(
  initial: Record<string, string> = {},
): KeyValueStorage {
  const data = new Map(Object.entries(initial));
  return {
    async get(key) {
      return data.get(key) ?? null;
    },
    async set(key, value) {
      data.set(key, value);
    },
    async remove(key) {
      data.delete(key);
    },
  };
}
