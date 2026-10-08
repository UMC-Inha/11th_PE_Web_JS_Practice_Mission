import { useBookmarkStore } from "../stores/bookmark-store";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  return (
    <button
     type="button"
     className="absolute right-2 top-2 rounded-sm bg-black/60 px-2 py-1 text-xs text-white" 
     onClick={() => toggleBookmark(movieId)}>
      {isBookmarked ? "북마크 해제" : "북마크 추가"}
    </button>
  );
}