import { apiClient } from "../api-client";
import type { ApiResponse } from "../models";
import type { MemberInfo } from "./get-me";

export interface UpdateMeRequest {
  nickname: string;
}

export function updateMe(body: UpdateMeRequest) {
  return apiClient
    .patch("members/me", { json: body })
    .json<ApiResponse<MemberInfo>>();
}
