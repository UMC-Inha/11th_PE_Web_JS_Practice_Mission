// 서버 공통 응답 래퍼
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}
