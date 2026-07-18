import AsyncStorage from "@react-native-async-storage/async-storage";

import type { KeyValueStorage } from "@/lib/storage";

// Default app backend: AsyncStorage (localStorage on web). Secrets do not
// belong here — add an expo-secure-store backend for those.
export const appStorage: KeyValueStorage = {
  get: (key) => AsyncStorage.getItem(key),
  set: (key, value) => AsyncStorage.setItem(key, value),
  remove: (key) => AsyncStorage.removeItem(key),
};
