import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useBookmarkStore } from "./bookmark-store";

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
      signIn: (accessToken) => {
        useBookmarkStore.getState().clearBookmarks();

        set({
          session: {
            id: crypto.randomUUID(),
            accessToken,
          },
          message: "",
        });
      },
      signOut: (message = "") => {
        useBookmarkStore.getState().clearBookmarks();

        set({
          session: null,
          message,
        });
      },
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