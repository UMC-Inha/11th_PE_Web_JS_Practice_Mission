import { HTTPError } from "ky";

// 서버가 내려준 { message }가 있으면 그걸, 없으면 fallback을 사용
// (ky는 에러 응답 본문을 미리 읽어 error.data에 넣어 두므로 response.json()은 쓸 수 없음)
export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof HTTPError) {
    const data = error.data;
    if (typeof data === "object" && data !== null && "message" in data) {
      const { message } = data as { message?: unknown };
      if (typeof message === "string" && message) return message;
    }
  }
  return fallback;
}
