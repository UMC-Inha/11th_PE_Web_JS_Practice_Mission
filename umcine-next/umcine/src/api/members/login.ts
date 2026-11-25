import { apiClient } from "../api-client";
import { unwrapResponse } from "../unwrap-response";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  nickname: string;
  accessToken: string;
}

export function login(body: LoginRequest) {
  return apiClient
    .post("auth/login", { json: body })
    .json<LoginResponse | { result: LoginResponse }>()
    .then(unwrapResponse);
}
