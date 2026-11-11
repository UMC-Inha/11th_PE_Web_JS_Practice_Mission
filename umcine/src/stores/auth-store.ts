import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  nickname: string;
  login: (session: { accessToken: string; nickname: string }) => void;
  setNickname: (nickname: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      nickname: "",
      login: (session) => set(session),
      setNickname: (nickname) => set({ nickname }),
      logout: () => set({ accessToken: null, nickname: "" }),
    }),
    {
      name: "umcine-auth",
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ accessToken, nickname }) => ({ accessToken, nickname }),
    },
  ),
);
