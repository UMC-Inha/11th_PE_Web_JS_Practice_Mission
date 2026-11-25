import { apiClient } from "../api-client";

export interface CheckNicknameDuplicateResponse {
  available: boolean;
}

export function isReservedNickname(nickname: string): boolean {
  return nickname === "." || nickname === "..";
}

export async function checkNicknameDuplicate(nickname: string) {
  if (isReservedNickname(nickname)) {
    throw new Error("점 하나 또는 두 개만으로 된 닉네임은 사용할 수 없어요.");
  }

  return apiClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckNicknameDuplicateResponse>();
}
