"use client";

import { browserStorage } from "../utils/browser-storage";
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
      skipHydration: true,
      storage: createJSONStorage(() => browserStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
      merge: (persisted, current) => ({
        ...current,
        accessToken: persisted && typeof persisted === "object" && "accessToken" in persisted &&
          typeof persisted.accessToken === "string" ? persisted.accessToken : null,
      }),
    },
  ),
);
