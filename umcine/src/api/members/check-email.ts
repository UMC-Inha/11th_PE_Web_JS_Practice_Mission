import { springClient } from "../spring-client";

interface CheckEmailResponse {
  available: boolean;
}

function checkEmail(email: string) {
  return springClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<CheckEmailResponse>();
}

export { checkEmail, type CheckEmailResponse };
