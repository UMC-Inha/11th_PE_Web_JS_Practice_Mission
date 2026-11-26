const tmdbApiBaseUrl = process.env.NEXT_PUBLIC_TMDB_API_BASE_URL;
const tmdbAccessToken = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!tmdbApiBaseUrl || !tmdbAccessToken || !apiBaseUrl) {
  throw new Error("TMDB와 백엔드 환경변수를 확인해 주세요.");
}

export const env = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
  apiBaseUrl,
};