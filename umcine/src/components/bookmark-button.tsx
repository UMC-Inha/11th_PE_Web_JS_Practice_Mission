import { useToggleFavorite } from "../hooks/use-toggle-favorite";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  className?: string;
}

export function BookmarkButton({ movieId, className }: BookmarkButtonProps) {
  const {
    isFavorite: isBookmarked,
    isPending,
    toggleFavorite,
  } = useToggleFavorite(movieId);

  return (
    <button
      type="button"
      aria-label={isBookmarked ? "북마크 해제" : "북마크"}
      aria-pressed={isBookmarked}
      disabled={isPending}
      onClick={toggleFavorite}
      className={cn(
        "flex size-6 cursor-pointer items-center justify-center rounded-md border text-white",
        isBookmarked
          ? "border-[#2563EB] bg-[#2563EB]"
          : "border-white/70 bg-[#17191E]/70",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
        {isBookmarked ? (
          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
        ) : (
          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15-5-2.18L7 18V5h10v13z" />
        )}
      </svg>
    </button>
  );
}
