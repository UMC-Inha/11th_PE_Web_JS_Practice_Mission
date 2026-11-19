import type { ApiResponse } from "../api-response";
import { authApi } from "../auth-api";

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

export async function getFavorites() {
  const res = await authApi.get("favorites").json<ApiResponse<Favorite[]>>();
  return res.result;
}
