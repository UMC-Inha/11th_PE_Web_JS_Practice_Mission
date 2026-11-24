import { authApi } from "../auth-api";
import type { RatingApiResponse } from "./models";

export interface UpdateRatingRequest {
  ratingId: number;
  score: number;
  comment: string;
}

export function updateRating({ ratingId, score, comment }: UpdateRatingRequest) {
  return authApi
    .patch(`ratings/${ratingId}`, { json: { score, comment } })
    .json<RatingApiResponse>();
}
