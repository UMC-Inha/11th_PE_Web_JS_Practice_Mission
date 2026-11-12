import ky from "ky";
import { env } from "../config/env";
import { useAuthStore } from "../stores/auth-store";

export const apiClient = ky.create({
  baseUrl: env.apiBaseUrl,
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
