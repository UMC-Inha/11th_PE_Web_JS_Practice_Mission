const tmdbApiBaseUrl = import.meta.env.VITE_TMDB_API_BASE_URL;
const tmdbAccessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

if (!tmdbApiBaseUrl || !tmdbAccessToken) {
  throw new Error("TMDB 환경 변수가 필요해요.");
}

const memberApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
if (!memberApiBaseUrl) {
  throw new Error("VITE_API_BASE_URL 환경 변수가 필요해요.");
}

const apiBaseUrl = new URL(memberApiBaseUrl);
if (apiBaseUrl.protocol !== "http:" && apiBaseUrl.protocol !== "https:") {
  throw new Error("VITE_API_BASE_URL은 HTTP 또는 HTTPS 주소여야 해요.");
}
apiBaseUrl.pathname = apiBaseUrl.pathname.replace(/\/+$/, "") + "/";

export const env = {
  apiBaseUrl: apiBaseUrl.href,
  tmdbApiBaseUrl,
  tmdbAccessToken,
};
