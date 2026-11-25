import { useAuthStore } from "../stores/auth-store";
import { useMyFavoritesQuery } from "./use-my-favorites-query";
import { useCreateFavoriteMutation } from "./use-create-favorite-mutation";
import { useDeleteFavoriteMutation } from "./use-delete-favorite-mutation";

// 북마크 여부는 서버의 즐겨찾기 목록을 기준으로 판단한다.
export function useToggleFavorite(movieId: number) {
  const isLoggedIn = !!useAuthStore((state) => state.accessToken);
  const myFavoritesQuery = useMyFavoritesQuery(isLoggedIn);
  const createFavoriteMutation = useCreateFavoriteMutation();
  const deleteFavoriteMutation = useDeleteFavoriteMutation();

  const isFavorite =
    isLoggedIn &&
    (myFavoritesQuery.data?.some((favorite) => favorite.movieId === movieId) ??
      false);
  const isPending =
    createFavoriteMutation.isPending || deleteFavoriteMutation.isPending;

  const toggleFavorite = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요해요.");
      return;
    }
    if (isFavorite) {
      deleteFavoriteMutation.mutate(movieId);
    } else {
      createFavoriteMutation.mutate({ movieId });
    }
  };

  return { isFavorite, isPending, toggleFavorite };
}
