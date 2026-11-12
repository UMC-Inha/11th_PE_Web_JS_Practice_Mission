import { create } from "zustand";

interface ProfileStore {
  nickname: string;
  email: string;
  updateProfile: (nickname: string) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  nickname: "riooo",
  email: "jiho@naver.com",
  updateProfile: (nickname) => set({ nickname }),
}));