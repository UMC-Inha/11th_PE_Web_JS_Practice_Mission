import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
}

function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      type="button"
      className={cn(
        "absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-md border-none bg-black/35",
        isBookmarked && "bg-app-accent",
      )}
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      onClick={() => toggleBookmark(movieId)}
    >
      <img
        className="h-4 w-4 brightness-0 invert"
        src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
        aria-hidden="true"
      />
    </button>
  );
}

export default BookmarkButton;
