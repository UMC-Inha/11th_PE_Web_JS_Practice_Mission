import { create } from "zustand";

export const useProfileStore = create<{
  images: Record<string, string>;
  setImage: (email: string, image: string) => void;
}>((set) => ({
  images: {},
  setImage: (email, image) =>
    set((state) => ({ images: { ...state.images, [email]: image } })),
}));
