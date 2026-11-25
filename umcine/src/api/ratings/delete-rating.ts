import { authApi } from "../auth-api";

// 204 No Content라 본문이 없음
export async function deleteRating(ratingId: number): Promise<void> {
  await authApi.delete(`ratings/${ratingId}`);
}
