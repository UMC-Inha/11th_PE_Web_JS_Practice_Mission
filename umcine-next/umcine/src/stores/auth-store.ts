import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  // localStorage 값을 다 불러왔는지 (서버와 첫 렌더링에서는 false)
  hasHydrated: boolean;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
}

// 새로고침해도 로그인이 유지되도록 localStorage에 저장
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      hasHydrated: false,
      setAccessToken: (accessToken) => set({ accessToken }),
      logout: () => set({ accessToken: null }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
      // 서버에는 localStorage가 없어서 서버 HTML은 항상 로그아웃 상태로 그려짐.
      // 바로 불러오면 첫 렌더링이 서버와 달라져 hydration 오류가 나므로,
      // 브라우저에서 마운트된 뒤 rehydrate()로 직접 불러옴 (app/providers.tsx)
      skipHydration: true,
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hasHydrated: true });
      },
    },
  ),
);
