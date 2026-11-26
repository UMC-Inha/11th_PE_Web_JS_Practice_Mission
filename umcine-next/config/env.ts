// Next.js는 NEXT_PUBLIC_ 변수를 "정적으로 직접 참조"할 때만 번들에 값을 넣어줌 (process.env[key] 같은 동적 접근 불가)
const tmdbApiBaseUrl = process.env.NEXT_PUBLIC_TMDB_API_BASE_URL;
const tmdbAccessToken = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

if (!tmdbApiBaseUrl || !tmdbAccessToken) {
  throw new Error("TMDB 환경 변수가 필요해요.");
}

export const env = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
};
