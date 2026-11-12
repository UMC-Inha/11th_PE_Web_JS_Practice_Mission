import type { ApiResponse } from "../api-response";
import { apiClient } from "../api-client";

interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

interface SignupResult {
  memberId: number;
  email: string;
  nickname: string;
}

type SignupResponse = ApiResponse<SignupResult>;

function signup(body: SignupRequest) {
  return apiClient.post("members", { json: body }).json<SignupResponse>();
}

export { signup, type SignupRequest, type SignupResponse };
