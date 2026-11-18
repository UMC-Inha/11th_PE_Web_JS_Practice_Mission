import { apiClient } from "../api-client";
import { unwrapResponse } from "../unwrap-response";
import type { MyInfo } from "./get-my-info";

export interface UpdateMyInfoRequest {
  nickname: string;
}

export function updateMyInfo(body: UpdateMyInfoRequest) {
  return apiClient
    .patch("members/me", { json: body })
    .json<MyInfo | { result: MyInfo }>()
    .then(unwrapResponse);
}
