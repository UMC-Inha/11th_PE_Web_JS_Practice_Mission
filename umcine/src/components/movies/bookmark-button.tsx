import { useQuery } from "@tanstack/react-query";
import { useToggleFavoriteMutation } from "../../hooks/use-toggle-favorite-mutation";
import { favoritesQueryOptions } from "../../queries/favorite-queries";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
}

function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const isLoggedIn = useAuthStore((state) => state.accessToken !== null);
  // 목록의 모든 카드가 같은 query를 쓰므로 즐겨찾기 목록은 한 번만 요청함
  const { data: favorites } = useQuery(favoritesQueryOptions(isLoggedIn));
  const isBookmarked =
    isLoggedIn && (favorites?.some((item) => item.movieId === movieId) ?? false);
  const { toggle, isPending } = useToggleFavoriteMutation();

  return (
    <button
      type="button"
      disabled={isPending}
      className={cn(
        "absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-md border-none bg-black/35 disabled:cursor-not-allowed disabled:opacity-60",
        isBookmarked && "bg-app-accent",
      )}
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      onClick={() => toggle(movieId, isBookmarked)}
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
