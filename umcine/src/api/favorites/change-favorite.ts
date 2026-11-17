import { authApi } from "../auth-api";
import type { Favorite } from "./get-favorites";

interface FavoriteResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export async function addFavorite(movieId: number) {
  const response = await authApi
    .post("favorites", { json: { movieId }, retry: 0 })
    .json<FavoriteResponse<Favorite>>();

  if (!response.isSuccess || !response.result) {
    throw new Error(response.message || "즐겨찾기 추가에 실패했어요.");
  }
  return response.result;
}

export async function removeFavorite(movieId: number) {
  const response = await authApi
    .delete(`favorites/${movieId}`, { retry: 0 })
    .json<FavoriteResponse<unknown>>();

  if (!response.isSuccess) {
    throw new Error(response.message || "즐겨찾기 해제에 실패했어요.");
  }
}
