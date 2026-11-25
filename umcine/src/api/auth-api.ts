import { useAuthStore } from "../stores/auth-store";
import { apiClient } from "./api-client";

// apiClient의 설정을 이어받아 인증 처리를 더한 인스턴스 (인증이 필요한 요청용)
export const authApi = apiClient.extend({
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      ({ response }) => {
        if (response.status === 401) {
          useAuthStore.getState().setAccessToken(null);
        }
      },
    ],
  },
});
