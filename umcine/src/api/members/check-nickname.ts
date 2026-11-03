import { springClient } from "../spring-client";

interface CheckNicknameResponse {
  available: boolean;
}

function checkNickname(nickname: string) {
  return springClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckNicknameResponse>();
}

export { checkNickname, type CheckNicknameResponse };
