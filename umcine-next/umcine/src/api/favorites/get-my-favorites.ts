import { apiClient } from "../api-client";
import { unwrapResponse } from "../unwrap-response";

export interface FavoriteResponse {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

export const MY_FAVORITES_QUERY_KEY = ["favorites"];

export function getMyFavorites() {
  return apiClient
    .get("favorites")
    .json<FavoriteResponse[] | { result: FavoriteResponse[] }>()
    .then(unwrapResponse);
}
