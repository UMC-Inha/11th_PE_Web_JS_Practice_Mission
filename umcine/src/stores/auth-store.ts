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
      // 서버에는 localStorage가 없으므로 브라우저에서만 읽도록 함
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
      // 서버 HTML과 첫 렌더링 결과를 맞추기 위해 자동 복원을 끄고,
      // Providers에서 마운트된 뒤에 직접 복원함 (hydration mismatch 방지)
      skipHydration: true,
    },
  ),
);

// localStorage에서 토큰을 복원했는지 여부 (서버에서는 항상 false)
export function useAuthHydrated() {
  return useSyncExternalStore(
    (onStoreChange) => useAuthStore.persist.onFinishHydration(onStoreChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}
