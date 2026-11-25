import { apiClient } from "../api-client";
import { unwrapResponse } from "../unwrap-response";

export interface CheckEmailDuplicateResponse {
  available: boolean;
}

// 백엔드는 { isSuccess, code, message, result: { available } } 로 응답하므로 result를 꺼냄
export function checkEmailDuplicate(email: string) {
  return apiClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<
      CheckEmailDuplicateResponse | { result: CheckEmailDuplicateResponse }
    >()
    .then(unwrapResponse);
}
