import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  iconOnly?: boolean;
}

export function BookmarkButton({
  movieId,
  movieTitle,
  iconOnly = false,
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  const buttonText = isBookmarked ? "북마크 해제" : "북마크 추가";

  return (
    <button
      type="button"
      aria-label={`${movieTitle} ${buttonText}`}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
        iconOnly
          ? "absolute top-2.5 right-2.5 h-9 w-9 border"
          : "h-11 gap-2 px-5 text-sm font-bold text-white",
        iconOnly
          ? isBookmarked
            ? "border-blue-600 bg-blue-600"
            : "border-white bg-[#191B20]/85"
          : "bg-blue-600",
      )}
    >
      <img
        src={
          isBookmarked
            ? "/icons/bookmark.svg"
            : "/icons/bookmark-outline.svg"
        }
        alt=""
        className={cn(
          "brightness-0 invert",
          iconOnly ? "h-6 w-6" : "h-5 w-5",
        )}
      />

      {!iconOnly && buttonText}
    </button>
  );
}