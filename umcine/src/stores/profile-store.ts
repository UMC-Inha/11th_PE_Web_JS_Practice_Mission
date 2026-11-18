import { create } from "zustand";

interface ProfileStore {
  nickname: string;
  email: string;
  profileImage: string | null;
  updateProfile: (nickname: string, profileImage: string | null) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  nickname: "gs0428",
  email: "gwangsoo@cinemalab.kr",
  profileImage: null,
  updateProfile: (nickname, profileImage) =>
    set({ nickname: nickname.trim(), profileImage }),
}));