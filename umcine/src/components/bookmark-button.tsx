import { useBookmarkStore } from "../stores/bookmark-store";

interface BookmarkButtonProps {
  movieId: number;
  variant?: "icon" | "detail";
}

export function BookmarkButton({ movieId, variant = "icon" }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  return (
    <button
      type="button"
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      className={variant === "detail"
        ? "inline-flex h-10 items-center gap-2 rounded-[8px] bg-blue-600 px-4 text-sm font-bold text-white"
        : `absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-[10px] ${isBookmarked ? "bg-blue-600" : "bg-[#202124]"}`}
      onClick={() => toggleBookmark(movieId)}
    >
      <img
        src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
        className={variant === "detail" ? "h-4 w-4 brightness-0 invert" : "brightness-0 invert"}
      />
      {variant === "detail" && (isBookmarked ? "북마크 해제" : "즐겨찾기")}
    </button>
  );
}
