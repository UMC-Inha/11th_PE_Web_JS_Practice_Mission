import type { ApiResponse } from "../api-response";
import { apiClient } from "../api-client";

interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment?: string;
}

type CreateRatingResponse = ApiResponse<unknown>;

function createRating(memberId: number, body: CreateRatingRequest) {
  return apiClient
    .post(`members/${memberId}/ratings`, { json: body })
    .json<CreateRatingResponse>();
}

export { createRating, type CreateRatingRequest, type CreateRatingResponse };
