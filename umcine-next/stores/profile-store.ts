"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ProfileStore {
  nickname: string;
  email: string;
  profileImage: string | null;
  updateProfile: (profile: {
    nickname: string;
    profileImage: string | null;
  }) => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      nickname: "gs0428",
      email: "gwangsoo@cinemalab.kr",
      profileImage: null,
      updateProfile: ({ nickname, profileImage }) =>
        set({ nickname, profileImage }),
    }),
    {
      name: "umcine-profile-store",
      storage: createJSONStorage(() => localStorage),
      // 서버에는 localStorage가 없고, 첫 클라이언트 렌더가 서버 HTML과 달라지면 hydration 오류가 나므로
      // 자동 복원을 끄고 Providers에서 마운트 후 rehydrate()로 복원한다.
      skipHydration: true,
      partialize: (state) => ({
        nickname: state.nickname,
        email: state.email,
        profileImage: state.profileImage,
      }),
    },
  ),
);
