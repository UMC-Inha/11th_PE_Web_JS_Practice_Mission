import { authApi } from "../auth-api";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string;
}

interface CreateRatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: number; // 등록된 ratingId
}

export async function createRating(body: CreateRatingRequest): Promise<number> {
  const response = await authApi
    .post("ratings", { json: body })
    .json<CreateRatingResponse>();
  return response.result;
}
