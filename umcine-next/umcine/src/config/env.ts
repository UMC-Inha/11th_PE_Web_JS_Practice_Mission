// NEXT_PUBLIC_ 값은 빌드할 때 문자열로 치환되므로 process.env.이름 으로 하나씩 직접 써야 함
const env = {
  tmdbApiBaseUrl: process.env.NEXT_PUBLIC_TMDB_API_BASE_URL,
  tmdbAccessToken: process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN,
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
};

export { env };
