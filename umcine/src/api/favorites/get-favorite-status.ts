import { authApi } from "../auth-api";

interface FavoriteStatusResponse {
  isSuccess: boolean;
  message: string;
  result: { isFavorite: boolean };
}

export async function getFavoriteStatus(movieId: number, signal?: AbortSignal) {
  const response = await authApi.get(`favorites/${movieId}`, { signal }).json<FavoriteStatusResponse>();
  if (!response.isSuccess || typeof response.result?.isFavorite !== "boolean") {
    throw new Error(response.message || "즐겨찾기 상태를 확인하지 못했어요.");
  }
  return response.result.isFavorite;
}
