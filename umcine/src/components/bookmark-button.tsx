import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

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
      onClick={() => toggleBookmark(movieId)}
      className={cn(
        "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md border",
        isBookmarked ? "border-[#4f5de8] bg-[#4f5de8]" : "border-white bg-black/40",
      )}
    >
      <img
        src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt={isBookmarked ? "북마크 해제" : "북마크 추가"}
        className="h-4 w-4 brightness-0 invert"
      />
    </button>
  );
}