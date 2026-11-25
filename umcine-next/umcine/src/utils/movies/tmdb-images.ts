const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function getTmdbImageUrl(path: string | null) {
  return path ? `${TMDB_IMAGE_BASE_URL}${path}` : "";
}

export { getTmdbImageUrl };
