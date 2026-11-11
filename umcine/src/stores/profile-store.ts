import { create } from "zustand";

interface Profile {
  email: string;
  nickname: string;
  image: string;
}

// 퍼블리싱 확인용 데이터. 회원 API 연결 시 실제 회원 정보로 교체해요.
export const useProfileStore = create<{
  profile: Profile;
  updateProfile: (profile: Profile) => void;
}>((set) => ({
  profile: { email: "member@example.com", nickname: "영화팬", image: "" },
  updateProfile: (profile) => set({ profile }),
}));