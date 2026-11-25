import { apiClient } from "../api-client";
import { unwrapResponse } from "../unwrap-response";

export interface CheckNicknameDuplicateResponse {
  available: boolean;
}

// 백엔드는 { isSuccess, code, message, result: { available } } 로 응답하므로 result를 꺼냄
export function checkNicknameDuplicate(nickname: string) {
  return apiClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<
      CheckNicknameDuplicateResponse | { result: CheckNicknameDuplicateResponse }
    >()
    .then(unwrapResponse);
}
