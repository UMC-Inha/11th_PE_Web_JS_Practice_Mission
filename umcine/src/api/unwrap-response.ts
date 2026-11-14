// 백엔드가 { isSuccess, code, message, result } 로 감싸서 응답하면 result만 꺼냄
export function unwrapResponse<T>(data: T | { result: T }): T {
  if (data !== null && typeof data === "object" && "result" in data) {
    return data.result;
  }
  return data;
}
