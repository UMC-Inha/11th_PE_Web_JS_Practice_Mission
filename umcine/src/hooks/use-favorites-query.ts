import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavorite, getFavorites, getFavoriteStatus, removeFavorite } from "../api/favorites";

const favoritesKey = (memberId: number | null) => ["favorites", memberId] as const;
const listKey = (memberId: number | null) => [...favoritesKey(memberId), "list"] as const;
const statusKey = (memberId: number | null, movieId: number) =>
  [...favoritesKey(memberId), "status", movieId] as const;

export function useFavoritesQuery(memberId: number | null, enabled = true) {
  return useQuery({
    queryKey: listKey(memberId),
    queryFn: ({ signal }) => getFavorites(signal),
    enabled: memberId !== null && enabled,
    retry: false,
  });
}

export function useFavoriteStatusQuery(memberId: number, movieId: number, enabled: boolean) {
  return useQuery({
    queryKey: statusKey(memberId, movieId),
    queryFn: ({ signal }) => getFavoriteStatus(movieId, signal),
    enabled,
    retry: false,
  });
}

export function useFavoriteMutation(memberId: number, movieId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    scope: { id: `favorite:${memberId}:${movieId}` },
    mutationFn: (isFavorite: boolean) =>
      isFavorite ? removeFavorite(movieId) : addFavorite(movieId),
    onSettled: async (_result, error, wasFavorite) => {
      const key = statusKey(memberId, movieId);
      if (!error) {
        await queryClient.cancelQueries({ queryKey: key });
        queryClient.setQueryData(key, !wasFavorite);
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: listKey(memberId) }),
        error ? queryClient.invalidateQueries({ queryKey: key }) : undefined,
      ]);
    },
  });
}
