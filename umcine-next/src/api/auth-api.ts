import { useAuthStore } from "../stores/auth-store";
import { apiClient } from "./api-client";

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
      ({ request, response }) => {
        if (response.status !== 401) return;

        // 401을 받은 요청의 토큰이 지금 토큰과 같을 때만 지움 (재로그인한 새 토큰은 유지)
        const sentToken = request.headers.get("Authorization")?.replace("Bearer ", "");
        const { accessToken, setAccessToken } = useAuthStore.getState();
        if (sentToken === accessToken) {
          setAccessToken(null);
        }
      },
    ],
  },
});