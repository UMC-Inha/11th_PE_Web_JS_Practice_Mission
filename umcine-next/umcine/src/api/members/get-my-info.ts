import { apiClient } from "../api-client";
import { unwrapResponse } from "../unwrap-response";

export interface MyInfo {
  email: string;
  nickname: string;
  createdAt: string;
}

export const MY_INFO_QUERY_KEY = ["members", "me"];

export function getMyInfo() {
  return apiClient
    .get("members/me")
    .json<MyInfo | { result: MyInfo }>()
    .then(unwrapResponse);
}
