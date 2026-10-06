import { create } from "zustand";

interface BookmarkStore {
  bookmarkedMovieIds: number[]; //bookmaarkid 배열을 상태로 들고 있음. 북마크 추가/해제 시 이 배열만 바뀌고, 영화 데이터 자체는 바뀌지 않음.
  toggleBookmark: (movieId: number) => void; //북마크 추가/해제 함수. movieId를 받아서 bookmarkedMovieIds 배열에 있으면 제거, 없으면 추가.
}

export const useBookmarkStore = create<BookmarkStore>((set) => ({
  bookmarkedMovieIds: [],
  toggleBookmark: (movieId) =>
    set((state) => ({
      bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
        ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
        : [...state.bookmarkedMovieIds, movieId],
    })),
}));