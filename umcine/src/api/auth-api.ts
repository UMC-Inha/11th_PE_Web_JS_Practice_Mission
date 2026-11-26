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
        const requestAuthorization = request.headers.get("Authorization");
        const currentAccessToken = useAuthStore.getState().accessToken;

        if (
          response.status === 401 &&
          currentAccessToken &&
          requestAuthorization === `Bearer ${currentAccessToken}`
        ) {
          useAuthStore.getState().setAccessToken(null);
        }
      },
    ],
  },
});
