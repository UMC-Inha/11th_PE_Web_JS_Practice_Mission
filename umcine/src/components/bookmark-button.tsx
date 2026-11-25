import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { addFavorite, deleteFavorite, getFavorite } from "../api/favorites";
import { useAuthStore } from "../stores/auth-store";
import { getMemberId } from "../utils/get-member-id";
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberId(accessToken);
  const isAuthenticated = Boolean(accessToken && memberId);

  const favoriteQuery = useQuery({
    queryKey: ["favorite", memberId, movieId],
    queryFn: () => getFavorite(movieId),
    enabled: isAuthenticated,
    retry: false,
  });

  const favoriteMutation = useMutation({
    mutationFn: async (input: {
      movieId: number;
      memberId: string;
      remove: boolean;
    }) => {
      if (input.remove) {
        await deleteFavorite(input.movieId);
      } else {
        await addFavorite(input.movieId);
      }

      return !input.remove;
    },
    onSuccess: (isFavorite, input) => {
      queryClient.setQueryData(
        ["favorite", input.memberId, input.movieId],
        isFavorite,
      );

      void queryClient.invalidateQueries({
        queryKey: ["favorites", input.memberId],
      });
    },
    onError: (_error, input) => {
      alert("즐겨찾기를 변경하지 못했어요. 다시 시도해 주세요.");

      void queryClient.invalidateQueries({
        queryKey: ["favorite", input.memberId, input.movieId],
      });

      void queryClient.invalidateQueries({
        queryKey: ["favorites", input.memberId],
      });
    },
  });

  const isBookmarked = isAuthenticated && favoriteQuery.data === true;

  const buttonText =
    favoriteQuery.isError && isAuthenticated
      ? "즐겨찾기 다시 확인"
      : isBookmarked
        ? "북마크 해제"
        : "북마크 추가";

  const handleClick = () => {
    if (!accessToken || !memberId) {
      alert("로그인 후 이용해 주세요.");
      void navigate({ to: "/login" });
      return;
    }

    if (favoriteQuery.isError) {
      void favoriteQuery.refetch();
      return;
    }

    if (favoriteQuery.isFetching || favoriteMutation.isPending) return;
    if (typeof favoriteQuery.data !== "boolean") return;

    favoriteMutation.mutate({
      movieId,
      memberId,
      remove: favoriteQuery.data,
    });
  };

  return (
    <button
      type="button"
      aria-label={`${movieTitle} ${buttonText}`}
      aria-pressed={isBookmarked}
      title={buttonText}
      onClick={handleClick}
      disabled={
        favoriteMutation.isPending ||
        (isAuthenticated && favoriteQuery.isFetching)
      }
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50",
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

      {!iconOnly && (favoriteMutation.isPending ? "처리 중…" : buttonText)}
    </button>
  );
}