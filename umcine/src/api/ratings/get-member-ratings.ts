import { apiClient } from "../api-client";
import type { Rating } from "./models";

// 누구나 볼 수 있는 공개 API라서 토큰 없이 apiClient로 요청합니다.
// 5주차에 만든 API라 응답이 공통 형식이 아니라 배열 그대로 옵니다.
export function getMemberRatings(memberId: number) {
  return apiClient.get(`members/${memberId}/ratings`).json<Rating[]>();
}
