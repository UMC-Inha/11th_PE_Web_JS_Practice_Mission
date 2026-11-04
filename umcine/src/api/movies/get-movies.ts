import type { TmdbMovieListResponse } from "./models";
import { tmdbClient } from "./tmdb-client";

type GetMoviesParams = {
  page?: number;
};

async function getMovies({
  page = 1,
}: GetMoviesParams = {}): Promise<TmdbMovieListResponse> {
  return tmdbClient
    .get("movie/popular", { searchParams: { page } })
    .json<TmdbMovieListResponse>();
}

export { getMovies, type GetMoviesParams };
