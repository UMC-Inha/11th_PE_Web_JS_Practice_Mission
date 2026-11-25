import { authApi } from "../auth-api";

// 응답 result가 null이라 본문은 읽지 않음
export async function removeFavorite(movieId: number): Promise<void> {
  await authApi.delete(`favorites/${movieId}`);
}
