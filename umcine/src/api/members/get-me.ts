import { apiClient } from "../api-client";
import type { ApiResponse } from "../models";

export interface MemberInfo {
  email: string;
  nickname: string;
  createdAt: string;
}

export function getMe() {
  return apiClient.get("members/me").json<ApiResponse<MemberInfo>>();
}
