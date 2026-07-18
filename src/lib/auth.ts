import { useSyncExternalStore } from "react";

// In-memory placeholder session. Swap the internals for real auth
// (secure store token, API session) without changing the exports.
let isSignedIn = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return isSignedIn;
}

function setSignedIn(value: boolean) {
  if (isSignedIn === value) return;
  isSignedIn = value;
  listeners.forEach((listener) => listener());
}

export function useIsSignedIn() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

// Non-react access, e.g. API clients and tests.
export const authStore = { subscribe, getSnapshot };

export function signIn() {
  setSignedIn(true);
}

export function signOut() {
  setSignedIn(false);
}
