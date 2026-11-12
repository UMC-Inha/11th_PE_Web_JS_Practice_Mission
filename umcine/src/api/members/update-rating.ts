import type { ApiResponse } from "../api-response";
import { springClient } from "../spring-client";

interface UpdateRatingRequest {
  score: number;
  comment?: string;
}

type UpdateRatingResponse = ApiResponse<unknown>;

function updateRating(
  memberId: number,
  ratingId: number,
  body: UpdateRatingRequest,
) {
  return springClient
    .patch(`members/${memberId}/ratings/${ratingId}`, { json: body })
    .json<UpdateRatingResponse>();
}

export { updateRating, type UpdateRatingRequest, type UpdateRatingResponse };
