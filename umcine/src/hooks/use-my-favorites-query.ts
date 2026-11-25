import { useQuery } from "@tanstack/react-query";
import {
  getMyFavorites,
  MY_FAVORITES_QUERY_KEY,
} from "../api/favorites/get-my-favorites";

export function useMyFavoritesQuery(enabled = true) {
  return useQuery({
    queryKey: MY_FAVORITES_QUERY_KEY,
    queryFn: getMyFavorites,
    enabled,
  });
}
