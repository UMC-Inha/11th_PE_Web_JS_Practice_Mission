import type { ApiResponse } from "../api-response";
import { apiClient } from "../api-client";

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
  return apiClient
    .patch(`members/${memberId}/ratings/${ratingId}`, { json: body })
    .json<UpdateRatingResponse>();
}

export { updateRating, type UpdateRatingRequest, type UpdateRatingResponse };
