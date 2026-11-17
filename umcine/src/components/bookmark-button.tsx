import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getFavoriteStatus } from "../api/favorites/get-favorite-status";
import { useAuthStore } from "../stores/auth-store";
import { useFavoritesQuery } from "../hooks/use-favorites-query";
import { useFavoriteMutation } from "../hooks/use-favorite-mutation";

interface BookmarkButtonProps {
  movieId: number;
  variant?: "icon" | "detail";
}

export function BookmarkButton({ movieId, variant = "icon" }: BookmarkButtonProps) {
  const token = useAuthStore((state) => state.accessToken);
  const navigate = useNavigate();
  const favoritesQuery = useFavoritesQuery();
  const statusQuery = useQuery({
    queryKey: ["favorites", "status", movieId, token],
    queryFn: ({ signal }) => getFavoriteStatus(movieId, signal),
    enabled: Boolean(token && variant === "detail"),
    retry: false,
  });
  const favoriteMutation = useFavoriteMutation(movieId);
  const isBookmarked = Boolean(token) && (variant === "detail" && statusQuery.data !== undefined
    ? statusQuery.data
    : favoritesQuery.data?.some((item) => item.movieId === movieId) ?? false);
  const isPending = favoriteMutation.isPending || (Boolean(token) && (favoritesQuery.isPending || (variant === "detail" && statusQuery.isPending)));

  function handleClick() {
    if (!token) {
      alert("로그인 후 즐겨찾기를 이용할 수 있어요.");
      void navigate({ to: "/login" });
      return;
    }
    if (isPending) return;
    if (favoritesQuery.isError) {
      alert("즐겨찾기를 불러오지 못했어요. 다시 조회할게요.");
      void favoritesQuery.refetch();
      return;
    }
    if (variant === "detail" && statusQuery.isError) {
      void statusQuery.refetch();
      return;
    }
    favoriteMutation.toggle(isBookmarked);
  }

  return (
    <button
      type="button"
      aria-pressed={isBookmarked}
      aria-busy={isPending}
      disabled={isPending}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      className={variant === "detail"
        ? "inline-flex h-10 items-center gap-2 rounded-[8px] bg-blue-600 px-4 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-50"
        : `absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-[10px] disabled:cursor-wait disabled:opacity-50 ${isBookmarked ? "bg-blue-600" : "bg-[#202124]"}`}
      onClick={handleClick}
    >
      <img
        src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
        className={variant === "detail" ? "h-4 w-4 brightness-0 invert" : "brightness-0 invert"}
      />
      {variant === "detail" && (isBookmarked ? "북마크 해제" : "즐겨찾기")}
    </button>
  );
}
