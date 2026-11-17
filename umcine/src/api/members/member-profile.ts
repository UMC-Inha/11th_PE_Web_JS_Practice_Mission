import { apiClient } from "../api-client";
import { useAuthStore } from "../../stores/auth-store";

export interface MemberProfile {
  email: string;
  nickname: string;
  createdAt: string | null;
}

interface MemberProfileResponse {
  isSuccess: boolean;
  result: MemberProfile | null;
}

function readMemberProfile({ isSuccess, result }: MemberProfileResponse): MemberProfile {
  if (isSuccess !== true || typeof result?.email !== "string" || typeof result.nickname !== "string") {
    throw new Error("회원 정보 응답을 확인할 수 없어요.");
  }

  return {
    email: result.email,
    nickname: result.nickname,
    createdAt: typeof result.createdAt === "string" ? result.createdAt : null,
  };
}

// 회원 API에만 인증 헤더를 전달해요. TMDB 요청에는 사용하지 않아요.
const memberClient = apiClient.extend({
  hooks: {
    afterResponse: [({ request, response }) => {
      const auth = useAuthStore.getState();
      if (response.status === 401 && request.headers.get("Authorization") === `Bearer ${auth.accessToken}`) {
        auth.logout();
      }
    }],
  },
});

export function getMemberProfile(token: string, signal?: AbortSignal) {
  return memberClient.get("members/me", {
    headers: { Authorization: `Bearer ${token}` }, signal, retry: 0,
  }).json<MemberProfileResponse>().then(readMemberProfile);
}

export function updateMemberProfile(token: string, nickname: string) {
  return memberClient.patch("members/me", {
    headers: { Authorization: `Bearer ${token}` },
    json: { nickname }, retry: 0,
  }).json<MemberProfileResponse>().then(readMemberProfile);
}
