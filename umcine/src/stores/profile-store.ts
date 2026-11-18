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
      partialize: (state) => ({
        nickname: state.nickname,
        email: state.email,
      }),
    },
  ),
);
