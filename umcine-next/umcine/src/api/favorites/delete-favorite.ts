import { apiClient } from "../api-client";

export function deleteFavorite(movieId: number) {
  return apiClient.delete(`favorites/${movieId}`).json<void>();
}
