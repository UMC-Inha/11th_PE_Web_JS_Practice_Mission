import { umcineClient } from "../umcine-client";

export interface CheckNicknameDuplicateResponse {
  available: boolean;
}

export function checkNicknameDuplicate(nickname: string) {
  return umcineClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckNicknameDuplicateResponse>();
}