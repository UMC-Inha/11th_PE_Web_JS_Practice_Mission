import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getFavoriteStatus } from "../api/favorites/get-favorite-status";
import { createFavorite } from "../api/favorites/create-favorite";
import { deleteFavorite } from "../api/favorites/delete-favorite";
import { useAuthStore } from "../stores/auth-store";

export function useFavorite(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  const statusQueryKey = ["favorites", "status", movieId];

  const statusQuery = useQuery({
    queryKey: statusQueryKey,
    queryFn: () => getFavoriteStatus(movieId),
    enabled:
      Boolean(accessToken) &&
      Number.isInteger(movieId) &&
      movieId > 0,
    retry: false,
  });

  const favoriteMutation = useMutation({
    mutationFn: async (nextIsFavorite: boolean) => {
      if (nextIsFavorite) {
        await createFavorite(movieId);
      } else {
        await deleteFavorite(movieId);
      }

      return nextIsFavorite;
    },

    onSuccess: async (isFavorite) => {
      queryClient.setQueryData(statusQueryKey, isFavorite);

      await queryClient.invalidateQueries({
        queryKey: ["favorites", "list"],
      });
    },

    onError: () => {
      alert("즐겨찾기를 변경하지 못했어요. 다시 시도해 주세요.");
    },
  });

  function toggleBookmark() {
    if (!accessToken) {
      alert("로그인이 필요해요.");
      return;
    }

    if (!statusQuery.isSuccess || favoriteMutation.isPending) {
      return;
    }

    favoriteMutation.mutate(!statusQuery.data);
  }

  return {
    isBookmarked: Boolean(accessToken) && statusQuery.data === true,
    isDisabled:
      Boolean(accessToken) &&
      (statusQuery.isPending ||
        statusQuery.isError ||
        favoriteMutation.isPending),
    isStatusError: statusQuery.isError,
    toggleBookmark,
  };
}