import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFavorite,
  deleteFavorite,
  getFavoriteStatus,
  getFavorites,
} from "../api/favorites/favorites";
import { useAuthStore } from "../stores/auth-store";

export function useFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
  });
}

export function useFavoriteStatusQuery(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["favorites", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken),
  });
}

export function useFavoriteMutations() {
  const queryClient = useQueryClient();

  const invalidateFavorites = (movieId: number) => {
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
    queryClient.invalidateQueries({ queryKey: ["favorites", movieId] });
  };

  const createMutation = useMutation({
    mutationFn: createFavorite,
    onSuccess: (_, movieId) => invalidateFavorites(movieId),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFavorite,
    onSuccess: (_, movieId) => invalidateFavorites(movieId),
  });

  return { createMutation, deleteMutation };
}
