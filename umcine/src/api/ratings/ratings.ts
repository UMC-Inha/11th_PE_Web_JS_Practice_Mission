import { apiClient } from "../api-client";
import { authApi } from "../auth-api";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export function getMemberRatings(memberId: number) {
  return apiClient.get(`members/${memberId}/ratings`).json<Rating[]>();
}

export function createRating(body: {
  movieId: number;
  score: number;
  comment: string;
}) {
  return authApi.post("ratings", { json: body }).json<ApiResponse<Rating>>();
}

export function updateRating(
  ratingId: number,
  body: { score: number; comment: string },
) {
  return authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<ApiResponse<Rating>>();
}

export function deleteRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json<ApiResponse<null>>();
}
