import { authApi } from "../auth-api";

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

export interface FavoriteStatus {
  isFavorite: boolean;
}

export function getFavorites() {
  return authApi.get("favorites").json<ApiResponse<Favorite[]>>();
}

export function getFavoriteStatus(movieId: number) {
  return authApi
    .get(`favorites/${movieId}`)
    .json<ApiResponse<FavoriteStatus>>();
}

export function createFavorite(movieId: number) {
  return authApi
    .post("favorites", { json: { movieId } })
    .json<ApiResponse<Favorite>>();
}

export function deleteFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>();
}
