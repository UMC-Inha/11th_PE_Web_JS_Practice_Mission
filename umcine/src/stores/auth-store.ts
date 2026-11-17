import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AuthSession {
  id: string;
  accessToken: string;
}

interface AuthStore {
  session: AuthSession | null;
  message: string;
  signIn: (accessToken: string) => void;
  signOut: (message?: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: null,
      message: "",
      signIn: (accessToken) =>
        set({
          session: {
            id: crypto.randomUUID(),
            accessToken,
          },
          message: "",
        }),
      signOut: (message = "") =>
        set({
          session: null,
          message,
        }),
    }),
    {
      name: "umcine-auth-session",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        session: state.session,
      }),
    },
  ),
);