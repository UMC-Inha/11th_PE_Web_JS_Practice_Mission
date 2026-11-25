import { apiClient } from "../api-client";
import { unwrapResponse } from "../unwrap-response";
import type { FavoriteResponse } from "./get-my-favorites";

export interface CreateFavoriteRequest {
  movieId: number;
}

export function createFavorite(body: CreateFavoriteRequest) {
  return apiClient
    .post("favorites", { json: body })
    .json<FavoriteResponse | { result: FavoriteResponse }>()
    .then(unwrapResponse);
}
