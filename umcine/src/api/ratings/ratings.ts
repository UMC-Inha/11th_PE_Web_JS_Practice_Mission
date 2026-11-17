import { authApi } from "../auth-api";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface RatingInput {
  movieId: number;
  score: number;
  comment: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  result: T;
}

function unwrap<T>(response: ApiResponse<T>): T {
  if (!response.isSuccess) throw new Error(response.message || "평점 요청에 실패했어요.");
  return response.result;
}

// 서버가 Authorization 토큰에서 회원을 식별해 본인의 평점만 반환해요.
export async function getMyRatings(signal?: AbortSignal): Promise<Rating[]> {
  return authApi.get("ratings", { signal }).json<Rating[] | ApiResponse<Rating[]>>()
    .then((response) => Array.isArray(response) ? response : unwrap(response));
}

export async function createRating(input: RatingInput): Promise<Rating> {
  return authApi.post("ratings", { json: input, retry: 0 }).json<ApiResponse<Rating>>().then(unwrap);
}

export async function updateRating(ratingId: number, input: RatingInput): Promise<Rating> {
  return authApi.patch(`ratings/${ratingId}`, { json: input, retry: 0 }).json<ApiResponse<Rating>>().then(unwrap);
}

export async function deleteRating(ratingId: number): Promise<void> {
  const response = await authApi.delete(`ratings/${ratingId}`, { retry: 0 }).json<ApiResponse<unknown>>();
  unwrap(response);
}
