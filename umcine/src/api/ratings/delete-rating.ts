import { apiClient } from "../api-client";

export function deleteRating(ratingId: number) {
  return apiClient.delete(`ratings/${ratingId}`).json<void>();
}
