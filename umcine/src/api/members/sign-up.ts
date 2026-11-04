import type { ApiResponse } from "../api-response";
import { springClient } from "../spring-client";

interface SignUpRequest {
  email: string;
  password: string;
  nickname: string;
}

type SignUpResponse = ApiResponse<unknown>;

function signUp(body: SignUpRequest) {
  return springClient.post("members", { json: body }).json<SignUpResponse>();
}

export { signUp, type SignUpRequest, type SignUpResponse };
