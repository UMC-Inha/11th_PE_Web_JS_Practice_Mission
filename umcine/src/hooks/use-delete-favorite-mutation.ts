import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFavorite } from "../api/favorites/delete-favorite";
import { MY_FAVORITES_QUERY_KEY } from "../api/favorites/get-my-favorites";
import { FAVORITE_STATUS_QUERY_KEY } from "../api/favorites/get-favorite-status";

export function useDeleteFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movieId: number) => deleteFavorite(movieId),
    onSuccess: (_, movieId) => {
      queryClient.invalidateQueries({ queryKey: MY_FAVORITES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: FAVORITE_STATUS_QUERY_KEY(movieId),
      });
    },
    onError: () => {
      alert("즐겨찾기 제거에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
