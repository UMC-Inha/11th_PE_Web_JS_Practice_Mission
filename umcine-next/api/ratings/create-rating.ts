import type { ApiResponse } from "../api-response";
import { authApi } from "../auth-api";
import type { MemberRating } from "./get-member-ratings";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment?: string;
}

export async function createRating(body: CreateRatingRequest) {
  const res = await authApi.post("ratings", { json: body }).json<ApiResponse<MemberRating>>();
  return res.result;
}
