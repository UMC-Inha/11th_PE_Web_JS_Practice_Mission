import { authApi } from "../auth-api";

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

interface FavoritesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Favorite[];
}

export async function getFavorites(signal?: AbortSignal) {
  const response = await authApi
    .get("favorites", { signal })
    .json<FavoritesResponse>();

  if (!response.isSuccess) {
    throw new Error(response.message);
  }

  return response.result;
}