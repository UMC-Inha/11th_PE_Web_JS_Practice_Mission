import { apiClient } from "./api-client";

// 토큰 첨부와 401 로그아웃 처리는 apiClient에 이미 있어서 그대로 물려받음
export const authApi = apiClient.extend({});
