import { authApi } from "../auth-api";
import type { RatingResponse } from "../members/models";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment?: string;
}

interface CreateRatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: RatingResponse;
}

export function createRating(body: CreateRatingRequest) {
  return authApi.post("ratings", { json: body }).json<CreateRatingResponse>();
}