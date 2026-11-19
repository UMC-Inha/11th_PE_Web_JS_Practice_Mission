import { useQuery } from "@tanstack/react-query";
import { getFavoriteStatus } from "../api/favorites/get-favorite-status";
import { getFavorites } from "../api/favorites/get-favorites";
import { queryKeys } from "../api/query-keys";
import { useAuthStore } from "../stores/auth-store";

export function useFavoritesQuery() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({ queryKey: queryKeys.favorites, queryFn: getFavorites, enabled: !!token });
}

export function useFavoriteStatusQuery(movieId: number) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: queryKeys.favoriteStatus(movieId),
    queryFn: () => getFavoriteStatus(movieId),
    enabled: !!token,
  });
}
