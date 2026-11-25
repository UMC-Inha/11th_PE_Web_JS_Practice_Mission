import { authApi } from "../auth-api";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

interface RatingsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Rating[];
}

export async function getMemberRatings(memberId: number): Promise<Rating[]> {
  // 배열을 그대로 주거나 공통 응답({ result })으로 감싸서 줘도 처리함
  const data = await authApi
    .get(`members/${memberId}/ratings`)
    .json<Rating[] | RatingsResponse>();
  return Array.isArray(data) ? data : data.result;
}
