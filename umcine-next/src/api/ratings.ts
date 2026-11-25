import { authApi } from "./auth-api";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

interface RatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Rating;
}

export interface RatingInput {
  score: number;
  comment: string;
}

export function getRatings(memberId: string) {
  return authApi.get(`members/${memberId}/ratings`).json<Rating[]>();
}

export async function createRating(body: RatingInput & { movieId: number }) {
  const response = await authApi
    .post("ratings", { json: body })
    .json<RatingResponse>();

  return response.result;
}

export async function updateRating(ratingId: number, body: RatingInput) {
  const response = await authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<RatingResponse>();

  return response.result;
}

export async function deleteRating(ratingId: number) {
  await authApi.delete(`ratings/${ratingId}`);
}
