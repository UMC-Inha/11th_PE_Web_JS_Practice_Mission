import type { TmdbMovieDetail } from "./models";
import { tmdbClient } from "./tmdb-client";

async function getMovieDetail(movieId: number): Promise<TmdbMovieDetail> {
  return tmdbClient.get(`movie/${movieId}`).json<TmdbMovieDetail>();
}

export { getMovieDetail };
