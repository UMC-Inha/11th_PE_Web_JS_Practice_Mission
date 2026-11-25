import { authApi } from "../auth-api";

export interface UpdateRatingRequest {
  ratingId: number;
  score: number;
  comment: string;
}

// 응답 result가 null이라 본문은 읽지 않음
export async function updateRating({
  ratingId,
  score,
  comment,
}: UpdateRatingRequest): Promise<void> {
  await authApi.patch(`ratings/${ratingId}`, { json: { score, comment } });
}
