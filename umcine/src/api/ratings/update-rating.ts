import { authApi } from "../auth-api";
import type { RatingResponse } from "../members/models";

export interface UpdateRatingRequest {
  ratingId: number;
  score?: number;
  comment?: string;
}

interface UpdateRatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: RatingResponse;
}

export function updateRating({ ratingId, ...body }: UpdateRatingRequest) {
  return authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<UpdateRatingResponse>();
}