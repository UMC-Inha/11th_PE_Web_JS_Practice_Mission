import {
  useFavoriteMutations,
  useFavoriteStatusQuery,
} from "../hooks/use-favorites";
import { useAuthStore } from "../stores/auth-store";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const favoriteStatusQuery = useFavoriteStatusQuery(movieId);
  const { createMutation, deleteMutation } = useFavoriteMutations();

  const isFavorite = favoriteStatusQuery.data?.result.isFavorite ?? false;
  const isPending =
    favoriteStatusQuery.isPending ||
    createMutation.isPending ||
    deleteMutation.isPending;

  const handleClick = () => {
    if (!accessToken) {
      alert("즐겨찾기는 로그인 후 사용할 수 있어요.");
      return;
    }

    if (isFavorite) {
      deleteMutation.mutate(movieId);
      return;
    }

    createMutation.mutate(movieId);
  };

  return (
    <button
      className="mt-4 inline-flex h-8 items-center gap-1 rounded bg-[#2563eb] px-3 text-xs font-semibold text-white hover:bg-[#1d4ed8] disabled:bg-[#9ab7ef]"
      type="button"
      onClick={handleClick}
      disabled={isPending}
    >
      <img
        className="h-3.5 w-3.5 brightness-0 invert"
        src={isFavorite ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
      />
      {isPending ? "처리 중" : isFavorite ? "즐겨찾기 해제" : "즐겨찾기"}
    </button>
  );
}
