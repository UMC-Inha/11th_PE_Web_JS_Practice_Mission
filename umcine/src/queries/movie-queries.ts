import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getMovieDetail } from "../api/movies/get-movie-detail";
import { getMovies } from "../api/movies/get-movies";
import { searchMovies } from "../api/movies/search-movies";

// 요청 종류(list/search/detail)와 파라미터가 key에 모두 들어가서 서로 다른 요청이 구분됨.
const movieKeys = {
  all: ["movies"] as const,
  list: (page: number) => [...movieKeys.all, "list", { page }] as const,
  search: (query: string, page = 1) =>
    [...movieKeys.all, "search", { query, page }] as const,
  detail: (movieId: number) => [...movieKeys.all, "detail", movieId] as const,
};

function movieListQueryOptions(page: number) {
  return queryOptions({
    queryKey: movieKeys.list(page),
    queryFn: () => getMovies({ page }),
    placeholderData: keepPreviousData,
  });
}

function movieSearchQueryOptions(query: string) {
  return queryOptions({
    queryKey: movieKeys.search(query),
    queryFn: () => searchMovies({ query }),
    enabled: query.length > 0,
  });
}

function movieDetailQueryOptions(movieId: number) {
  return queryOptions({
    queryKey: movieKeys.detail(movieId),
    queryFn: () => getMovieDetail(movieId),
    // 상세 조회는 30초 동안만 fresh로 취급함. (전역 기본값은 1분)
    staleTime: 1000 * 30,
  });
}

export {
  movieDetailQueryOptions,
  movieKeys,
  movieListQueryOptions,
  movieSearchQueryOptions,
};
