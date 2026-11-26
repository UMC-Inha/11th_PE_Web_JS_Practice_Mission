"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
      // 서버에는 localStorage가 없고, 첫 클라이언트 렌더가 서버 HTML과 달라지면 hydration 오류가 나므로
      // 자동 복원을 끄고 Providers에서 마운트 후 rehydrate()로 복원한다.
      skipHydration: true,
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
);

// persist 복원(rehydrate)이 끝났는지 구독하는 훅. 복원 전에는 accessToken이 항상 null이라
// 인증 가드가 이 값을 보고 판단을 미룬다. (서버/첫 렌더는 false)
export function useAuthHydrated() {
  return useSyncExternalStore(
    (onChange) => useAuthStore.persist.onFinishHydration(onChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}
