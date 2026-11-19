import { useFavorite } from "../hooks/use-favorite";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const {
    isBookmarked,
    isDisabled,
    isStatusError,
    toggleBookmark,
  } = useFavorite(movieId);

  return (
    <button
      type="button"
      className={`absolute right-2 top-2 grid size-8 cursor-pointer place-items-center rounded-sm disabled:cursor-not-allowed disabled:opacity-50 ${
        isBookmarked ? "bg-blue-600" : "bg-black/60"
      }`}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      aria-pressed={isBookmarked}
      disabled={isDisabled}
      title={
        isStatusError
          ? "즐겨찾기 상태를 불러오지 못했어요."
          : undefined
      }
      onClick={toggleBookmark}
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