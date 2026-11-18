import { authApi } from "./auth-api";

export interface Favorite {
  favoriteId: number | string;
  movieId: number | string;
  createdAt: string;
}

interface FavoriteStatus {
  isFavorite: boolean;
}

export async function getFavorites(signal?: AbortSignal) {
  const response = await authApi.get("favorites", { signal }).json<{ result: Favorite[] }>();
  return response.result;
}

export async function getFavoriteStatus(movieId: number, signal?: AbortSignal) {
  const response = await authApi
    .get(`favorites/${movieId}`, { signal })
    .json<{ result: FavoriteStatus }>();
  return response.result.isFavorite;
}

export async function addFavorite(movieId: number) {
  await authApi.post("favorites", { json: { movieId } });
}

export async function removeFavorite(movieId: number) {
  await authApi.delete(`favorites/${movieId}`);
}
