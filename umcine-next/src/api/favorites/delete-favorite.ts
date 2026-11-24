import { authApi } from "../auth-api";

export function deleteFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json();
}