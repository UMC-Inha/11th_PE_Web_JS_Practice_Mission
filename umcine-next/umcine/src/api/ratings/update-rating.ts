import { apiClient } from "../api-client";
import { unwrapResponse } from "../unwrap-response";
import type { RatingResponse } from "./get-member-ratings";

export interface UpdateRatingRequest {
  score: number;
  comment?: string;
}

export function updateRating(ratingId: number, body: UpdateRatingRequest) {
  return apiClient
    .patch(`ratings/${ratingId}`, { json: body })
    .json<RatingResponse | { result: RatingResponse }>()
    .then(unwrapResponse);
}
