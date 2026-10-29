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
    className={`absolute right-2 top-2 grid size-8 cursor-pointer place-items-center rounded-sm ${
      isBookmarked ? "bg-blue-600" : "bg-black/60"
    }`}
    aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
    aria-pressed={isBookmarked}
    onClick={() => toggleBookmark(movieId)}
  >
    <img
      src={
            isBookmarked
          ? "/icons/bookmark.svg"
          : "/icons/bookmark-outline.svg"
        }
        alt=""
        className="invert"
      />
    </button>
  );
}