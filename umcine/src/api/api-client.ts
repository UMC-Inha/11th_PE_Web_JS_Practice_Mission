import ky from "ky";
import { env } from "../config/env";
import { useAuthStore } from "../stores/auth-store";

// baseUrl에 경로가 있고 끝에 /가 없으면 상대 경로 요청이 그 경로를 버리므로 /를 보장함
const normalizedBaseUrl =
  env.apiBaseUrl && !env.apiBaseUrl.endsWith("/")
    ? `${env.apiBaseUrl}/`
    : env.apiBaseUrl;

export const apiClient = ky.create({
  baseUrl: normalizedBaseUrl,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        // 로그인 상태면 모든 요청에 토큰을 실어 보냄
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
  },
});
