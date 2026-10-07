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
    // movie-card.tsx에 있던 포스터 위 아이콘 배지 스타일을 그대로 옮김
    <button
      type="button"
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
      className={cn(
        "absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-lg border-none cursor-pointer transition-colors",
        isBookmarked ? "bg-blue-600" : "bg-black/55",
      )}
    >
      <img
        src={
          isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"
        }
        alt={isBookmarked ? "북마크 해제" : "북마크 추가"}
        className="size-4 invert" // SVG가 검정(fill=black)이라 어두운 배지 위에서 흰색으로 보이도록 반전
      />
    </button>
  );
}
