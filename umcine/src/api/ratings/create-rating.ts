import { apiClient } from "../api-client";
import { unwrapResponse } from "../unwrap-response";
import type { RatingResponse } from "./get-member-ratings";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment?: string;
}

export function createRating(body: CreateRatingRequest) {
  return apiClient
    .post("ratings", { json: body })
    .json<RatingResponse | { result: RatingResponse }>()
    .then(unwrapResponse);
}
