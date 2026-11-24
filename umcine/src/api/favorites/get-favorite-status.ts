import { authApi } from "../auth-api";
import type { ApiResponse } from "./models";

export async function getFavoriteStatus(movieId: number): Promise<boolean> {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<ApiResponse<{ isFavorite: boolean }>>();
  return response.result.isFavorite;
}