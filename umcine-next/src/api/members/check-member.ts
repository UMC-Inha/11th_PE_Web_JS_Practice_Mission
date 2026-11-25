import { umcineClient } from "../umcine-client";
import type { CheckResponse } from "./models";

function checkNickname(nickname: string) {
  return umcineClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckResponse>();
}

function checkEmail(email: string) {
  return umcineClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<CheckResponse>();
}

export { checkNickname, checkEmail };