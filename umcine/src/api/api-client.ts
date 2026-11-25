import ky from "ky";
import { env } from "../config/env";

// baseUrl에 경로가 있고 끝에 /가 없으면 상대 경로 요청이 그 경로를 버리므로 /를 보장함
const normalizedBaseUrl =
  env.apiBaseUrl && !env.apiBaseUrl.endsWith("/")
    ? `${env.apiBaseUrl}/`
    : env.apiBaseUrl;

// 인증이 필요 없는 요청(회원가입, 로그인, 중복 확인)용 기본 인스턴스
export const apiClient = ky.create({ baseUrl: normalizedBaseUrl });
