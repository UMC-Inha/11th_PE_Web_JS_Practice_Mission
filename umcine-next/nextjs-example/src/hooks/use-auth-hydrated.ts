
"use client";
import { useSyncExternalStore } from "react";
import { useAuthStore } from "../stores/auth-store";
function subscribe(onChange: () => void) {
  const start = useAuthStore.persist.onHydrate(onChange);
  const finish = useAuthStore.persist.onFinishHydration(onChange);
  return () => { start(); finish(); };
}
export function useAuthHydrated() {
  return useSyncExternalStore(subscribe, useAuthStore.persist.hasHydrated, () => false);
}
