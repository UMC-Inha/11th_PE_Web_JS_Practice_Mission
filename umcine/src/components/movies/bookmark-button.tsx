import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

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
      className={cn(
        "absolute right-[10px] top-[10px] flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[#17191e] p-[5px]",
        isBookmarked && "border-[#2563eb] bg-[#2563eb]",
      )}
      type="button"
      aria-label="북마크"
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
    >
      <img
        className="h-6 w-6 brightness-0 invert"
        src={
          isBookmarked
            ? "/icons/bookmark.svg"
            : "/icons/bookmark-outline.svg"
        }
        alt=""
      />
    </button>
  );
}