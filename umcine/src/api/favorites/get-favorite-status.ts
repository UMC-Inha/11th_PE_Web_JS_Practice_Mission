import type { ApiResponse } from "../api-response";
import { authApi } from "../auth-api";

export async function getFavoriteStatus(movieId: number) {
  const res = await authApi
    .get(`favorites/${movieId}`)
    .json<ApiResponse<{ isFavorite: boolean }>>();
  return res.result.isFavorite;
}
