import { umcineClient } from "../umcine-client";

export interface CheckEmailDuplicateResponse {
  available: boolean;
}

export function checkEmailDuplicate(email: string) {
  return umcineClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<CheckEmailDuplicateResponse>();
}