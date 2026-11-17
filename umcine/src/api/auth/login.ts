import { apiClient } from "../api-client";

export interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResult {
  nickname: string;
  accessToken: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: LoginResult | null;
}

export async function login(body: LoginRequest) {
  const { isSuccess, result } = await apiClient
    .post("auth/login", { json: body, retry: 0 })
    .json<LoginResponse>();

  if (
    isSuccess !== true ||
    typeof result?.accessToken !== "string" ||
    !result.accessToken ||
    typeof result.nickname !== "string"
  ) {
    throw new Error("로그인 응답을 확인할 수 없어요.");
  }

  return result;
}
