const tmdbApiBaseUrl = import.meta.env.VITE_TMDB_API_BASE_URL;
const tmdbAccessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

if (!tmdbApiBaseUrl || !tmdbAccessToken) {
  throw new Error("TMDB 환경 변수가 필요해요.");
}

export const env = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "",
};

export class ApiConfigurationError extends Error {
  constructor() {
    super(
      "개발용 API 주소가 설정되지 않았어요. 프로젝트 루트의 .env.local에 VITE_API_BASE_URL을 백엔드 API 주소로 설정하고 개발 서버를 재시작해 주세요.",
    );
    this.name = "ApiConfigurationError";
  }
}

export function assertApiConfigured() {
  if (import.meta.env.DEV && !env.apiBaseUrl.trim()) {
    throw new ApiConfigurationError();
  }
}
