import { authApi } from "./auth-api";

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export async function getFavorites() {
  const response = await authApi
    .get("favorites")
    .json<ApiResponse<Favorite[]>>();

  return response.result;
}

export async function getFavorite(movieId: number) {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<ApiResponse<{ isFavorite: boolean }>>();

  return response.result.isFavorite;
}

export async function addFavorite(movieId: number) {
  const response = await authApi
    .post("favorites", { json: { movieId } })
    .json<ApiResponse<Favorite>>();

  return response.result;
}

export async function deleteFavorite(movieId: number) {
  await authApi.delete(`favorites/${movieId}`);
}
