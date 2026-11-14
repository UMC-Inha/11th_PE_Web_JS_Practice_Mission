const env = {
  tmdbApiBaseUrl: import.meta.env.VITE_TMDB_API_BASE_URL,
  tmdbAccessToken: import.meta.env.VITE_TMDB_ACCESS_TOKEN,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "",
};

export { env };
