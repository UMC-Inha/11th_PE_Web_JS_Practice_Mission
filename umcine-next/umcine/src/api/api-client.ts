import ky from "ky";
import { env } from "../config/env";
import { useAuthStore } from "../stores/auth-store";

export const apiClient = ky.create({
  baseUrl: env.apiBaseUrl,
  hooks: {
    beforeRequest: [
      // 로그인했다면 모든 요청에 토큰을 붙임
      ({ request }) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      // 토큰이 만료되거나 잘못되면 로그아웃 처리
      ({ response }) => {
        if (response.status === 401) useAuthStore.getState().logout();
      },
    ],
  },
});
