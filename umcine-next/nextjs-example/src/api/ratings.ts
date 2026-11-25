import { apiClient } from "./api-client";
import { authApi } from "./auth-api";

export interface Rating {
  ratingId: number | string;
  movieId: number | string;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

interface RatingInput {
  score: number;
  comment: string | null;
}

export function getMemberRatings(memberId: number, signal?: AbortSignal) {
  return apiClient.get(`members/${memberId}/ratings`, { signal }).json<Rating[]>();
}

export async function createRating(movieId: number, input: RatingInput) {
  const response = await authApi
    .post("ratings", { json: { movieId, ...input } })
    .json<{ result: Rating }>();
  return response.result;
}

export async function updateRating(ratingId: Rating["ratingId"], input: RatingInput) {
  const response = await authApi
    .patch(`ratings/${ratingId}`, { json: input })
    .json<{ result: Rating }>();
  return response.result;
}

export async function deleteRating(ratingId: Rating["ratingId"]) {
  await authApi.delete(`ratings/${ratingId}`);
}
