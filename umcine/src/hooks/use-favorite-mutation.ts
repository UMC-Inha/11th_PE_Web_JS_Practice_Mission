import { useIsMutating, useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite, removeFavorite } from "../api/favorites/change-favorite";
import type { Favorite } from "../api/favorites/get-favorites";
import { useAuthStore } from "../stores/auth-store";
import { favoritesQueryKey } from "./use-favorites-query";

export function useFavoriteMutation(movieId: number) {
  const token = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const mutationKey = ["favorites", "toggle", token, movieId];
  const pendingCount = useIsMutating({ mutationKey });
  const mutation = useMutation({
    mutationKey,
    mutationFn: async (isBookmarked: boolean) => {
      if (!token || useAuthStore.getState().accessToken !== token) {
        throw new Error("로그인이 필요해요.");
      }
      if (isBookmarked) {
        await removeFavorite(movieId);
        return null;
      }
      return addFavorite(movieId);
    },
    onSuccess: async (favorite) => {
      if (useAuthStore.getState().accessToken !== token) return;
      const queryKey = favoritesQueryKey(token);
      await queryClient.cancelQueries({ queryKey });
      if (useAuthStore.getState().accessToken !== token) return;

      queryClient.setQueryData<Favorite[]>(queryKey, (previous) => {
        if (!previous) return previous;
        const remaining = previous.filter((item) => item.movieId !== movieId);
        return favorite ? [favorite, ...remaining] : remaining;
      });
      queryClient.setQueryData(["favorites", "status", movieId, token], Boolean(favorite));
      await queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      if (useAuthStore.getState().accessToken !== token) return;
      alert("즐겨찾기 변경에 실패했어요. 다시 시도해 주세요.");
    },
  });

  function toggle(isBookmarked: boolean) {
    if (queryClient.isMutating({ mutationKey }) > 0) return;
    mutation.mutate(isBookmarked);
  }

  return { toggle, isPending: mutation.isPending || pendingCount > 0 };
}
