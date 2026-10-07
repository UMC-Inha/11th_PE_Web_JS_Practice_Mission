import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  variant?: "icon" | "text";
  className?: string;
}

export function BookmarkButton({ movieId, variant = "text", className }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) => state.bookmarkedMovieIds.includes(movieId));
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  return (
    <button
      type="button"
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
      className={cn(
        "flex items-center justify-center rounded-md text-white",
        variant === "icon" ? "h-8 w-8 border border-white p-0" : "gap-2 px-4 py-3 text-sm font-bold",
        isBookmarked ? "bg-[#2864fa]" : "bg-black/55",
        className,
      )}
    >
      <img
        src={isBookmarked ? "/movie-icons/bookmark.svg" : "/movie-icons/bookmark-outline.svg"}
        alt=""
        className={cn("brightness-0 invert", variant === "icon" ? "h-5 w-5" : "h-4 w-4")}
      />
      {variant === "text" && (isBookmarked ? "북마크 해제" : "북마크 추가")}
    </button>
  );
}
