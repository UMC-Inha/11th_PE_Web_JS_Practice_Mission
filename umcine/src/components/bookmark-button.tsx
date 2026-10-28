import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  variant?: "icon" | "label";
}

export function BookmarkButton({
  movieId,
  variant = "icon",
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const iconSrc = isBookmarked
    ? "/icons/bookmark.svg"
    : "/icons/bookmark-outline.svg";

  if (variant === "label") {
    return (
      <button
        type="button"
        aria-pressed={isBookmarked}
        onClick={() => toggleBookmark(movieId)}
        className={cn(
          "mt-5 inline-flex h-9 cursor-pointer items-center gap-2 rounded-md px-3.5 text-xs font-bold text-white",
          isBookmarked ? "bg-[#1d4ed8]" : "bg-[#2563EB]",
        )}
      >
        <img src={iconSrc} alt="" className="size-3.5 brightness-0 invert" />
        즐겨찾기
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      onClick={() => toggleBookmark(movieId)}
      className={cn(
        "absolute top-2 right-2 grid size-7 cursor-pointer place-items-center rounded-md border p-0",
        isBookmarked
          ? "border-[#2563EB] bg-[#2563EB]"
          : "border-white/85 bg-black/55",
      )}
    >
      <img src={iconSrc} alt="" className="size-3.5 brightness-0 invert" />
    </button>
  );
}