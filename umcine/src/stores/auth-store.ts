import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  nickname: string;
  login: (session: { accessToken: string; nickname: string }) => void;
  logout: () => void;
  setNickname: (nickname: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
      nickname: "",
      login: (session) => set({ accessToken: session.accessToken, nickname: session.nickname }),
      logout: () => set({ accessToken: null, nickname: "" }),
      setNickname: (nickname) => set({ nickname }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
);
