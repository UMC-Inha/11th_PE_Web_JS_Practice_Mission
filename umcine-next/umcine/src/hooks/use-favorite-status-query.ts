import { useQuery } from "@tanstack/react-query";
import {
  getFavoriteStatus,
  FAVORITE_STATUS_QUERY_KEY,
} from "../api/favorites/get-favorite-status";

export function useFavoriteStatusQuery(movieId: number, enabled = true) {
  return useQuery({
    queryKey: FAVORITE_STATUS_QUERY_KEY(movieId),
    queryFn: () => getFavoriteStatus(movieId),
    enabled,
  });
}
