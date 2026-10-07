import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
}

function validIds(value: unknown): number[] {
  return Array.isArray(value) && value.every((id) => typeof id === "number" && Number.isInteger(id) && id > 0)
    ? [...new Set<number>(value)]
    : [];
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set) => ({
      // 저장값이 없으면 빈 배열로 시작하고, persist가 localStorage의 값을 복원해요.
      bookmarkedMovieIds: [],
      toggleBookmark: (movieId) => {
        if (!Number.isInteger(movieId) || movieId <= 0) return;
        set((state) => ({
          bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
            ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
            : [...state.bookmarkedMovieIds, movieId],
        }));
      },
    }),
    {
      name: "umcine-bookmark-store",
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          try {
            const value = localStorage.getItem(name);
            if (value === null) return null;
            const parsed: unknown = JSON.parse(value);
            if (!parsed || typeof parsed !== "object" || !("state" in parsed)) {
              return JSON.stringify({ state: { bookmarkedMovieIds: [] }, version: 0 });
            }
            return value;
          } catch {
            return JSON.stringify({ state: { bookmarkedMovieIds: [] }, version: 0 });
          }
        },
        setItem: (name, value) => {
          try { localStorage.setItem(name, value); }
          catch { console.warn("북마크를 브라우저에 저장하지 못했어요."); }
        },
        removeItem: (name) => {
          try { localStorage.removeItem(name); }
          catch { console.warn("저장된 북마크를 지우지 못했어요."); }
        },
      })),
      partialize: (state) => ({ bookmarkedMovieIds: state.bookmarkedMovieIds }),
      merge: (persisted, current) => ({
        ...current,
        bookmarkedMovieIds: validIds(
          persisted && typeof persisted === "object" && "bookmarkedMovieIds" in persisted
            ? persisted.bookmarkedMovieIds
            : undefined,
        ),
      }),
    },
  ),
);


