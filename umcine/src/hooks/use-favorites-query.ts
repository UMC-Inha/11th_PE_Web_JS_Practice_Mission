import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "../api/favorites/get-favorites";
import { useAuthStore } from "../stores/auth-store";

export const favoritesQueryKey = (token: string | null) => ["favorites", "list", token] as const;

export function useFavoritesQuery() {
  const token = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: favoritesQueryKey(token),
    queryFn: ({ signal }) => getFavorites(signal),
    enabled: Boolean(token),
    staleTime: 30 * 1000,
    retry: false,
  });
}
