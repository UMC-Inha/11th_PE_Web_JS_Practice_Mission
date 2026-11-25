import { apiClient } from "../api-client";

export interface RatingResponse {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export const MEMBER_RATINGS_QUERY_KEY = (memberId: number) => [
  "members",
  memberId,
  "ratings",
];

export function getMemberRatings(memberId: number) {
  return apiClient.get(`members/${memberId}/ratings`).json<RatingResponse[]>();
}
