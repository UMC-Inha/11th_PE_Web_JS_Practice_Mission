import { apiClient } from "../api-client";
import { unwrapResponse } from "../unwrap-response";

export interface FavoriteStatusResponse {
  isFavorite: boolean;
}

export const FAVORITE_STATUS_QUERY_KEY = (movieId: number) => [
  "favorites",
  movieId,
];

export function getFavoriteStatus(movieId: number) {
  return apiClient
    .get(`favorites/${movieId}`)
    .json<FavoriteStatusResponse | { result: FavoriteStatusResponse }>()
    .then(unwrapResponse);
}
