import { queryOptions } from "@tanstack/react-query";
import { getMovies } from "../api/movies/get-movies";
import { searchMovies } from "../api/movies/search-movies";
import { getMovieDetail } from "../api/movies/get-movie-detail";

export function getMovieListOptions(page: number) {
  return queryOptions({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });
}

export function getMovieSearchOptions(query: string) {
  return queryOptions({
    queryKey: ["movies", "search", { query }],
    queryFn: () => searchMovies({ query }),
    enabled: query.length > 0,
  });
}

export function getMovieDetailOptions(movieId: number) {
  return queryOptions({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    staleTime: 30 * 1000,
    enabled: Number.isInteger(movieId) && movieId > 0,
  });
}