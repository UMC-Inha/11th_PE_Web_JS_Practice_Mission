import type { TmdbMovieListResponse } from "./models";
import { tmdbClient } from "./tmdb-client";

type SearchMoviesParams = {
  query: string;
  page?: number;
};

async function searchMovies({
  query,
  page = 1,
}: SearchMoviesParams): Promise<TmdbMovieListResponse> {
  return tmdbClient
    .get("search/movie", { searchParams: { query, page } })
    .json<TmdbMovieListResponse>();
}

export { searchMovies, type SearchMoviesParams };
