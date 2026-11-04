import { isHTTPError } from "ky";
import type { ApiResponse } from "../api/api-response";

export async function getServerErrorMessage(error: unknown) {
  if (isHTTPError(error)) {
    try {
      const body = await error.response.clone().json<ApiResponse<null>>();
      if (body.message) return body.message;
    } catch {
      // 본문이 JSON이 아니면 아래 기본 문구를 쓴다
    }
  }

  return "요청에 실패했어요. 잠시 후 다시 시도해 주세요.";
}
