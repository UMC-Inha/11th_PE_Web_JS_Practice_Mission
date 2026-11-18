import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFavorite } from "../api/favorites/create-favorite";
import { MY_FAVORITES_QUERY_KEY } from "../api/favorites/get-my-favorites";
import { FAVORITE_STATUS_QUERY_KEY } from "../api/favorites/get-favorite-status";
import { useBookmarkStore } from "../stores/bookmark-store";

export function useCreateFavoriteMutation() {
  const queryClient = useQueryClient();
  const addBookmark = useBookmarkStore((state) => state.addBookmark);

  return useMutation({
    mutationFn: createFavorite,
    onSuccess: (data) => {
      addBookmark(data.movieId);
      queryClient.invalidateQueries({ queryKey: MY_FAVORITES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: FAVORITE_STATUS_QUERY_KEY(data.movieId),
      });
    },
    onError: () => {
      alert("즐겨찾기 추가에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
