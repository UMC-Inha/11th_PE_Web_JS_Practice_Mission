import { apiClient } from "../api-client";
import { unwrapResponse } from "../unwrap-response";
import type { RatingResponse } from "../ratings/get-member-ratings";
import type { FavoriteResponse } from "../favorites/get-my-favorites";

export interface CreateMovieRecordRequest {
  movieId: number;
  score: number;
  comment?: string;
  addToFavorites: boolean;
}

export interface MovieRecordResponse {
  rating: RatingResponse;
  favorite: FavoriteResponse | null;
}

export function createMovieRecord(body: CreateMovieRecordRequest) {
  return apiClient
    .post("movie-records", { json: body })
    .json<MovieRecordResponse | { result: MovieRecordResponse }>()
    .then(unwrapResponse);
}
