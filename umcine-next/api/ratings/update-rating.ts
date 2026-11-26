import type { ApiResponse } from "../api-response";
import { authApi } from "../auth-api";
import type { MemberRating } from "./get-member-ratings";

export interface UpdateRatingRequest {
  score: number;
  comment?: string;
}

export async function updateRating(ratingId: number, body: UpdateRatingRequest) {
  const res = await authApi.patch(`ratings/${ratingId}`, { json: body }).json<ApiResponse<MemberRating>>();
  return res.result;
}