import { queryOptions } from '@tanstack/react-query'
import { getMovieDetail } from './get-movie-details'
import { getMovies } from './get-movies'
import { searchMovies } from './search-movies'

export const movieListQueryOptions = (page: number) =>
  queryOptions({
    queryKey: ['movies', 'list', { page }],
    queryFn: () => getMovies({ page }),
  })

export const movieSearchQueryOptions = (query: string) =>
  queryOptions({
    queryKey: ['movies', 'search', { query }],
    queryFn: () => searchMovies({ query }),
    enabled: query.length > 0,
  })

export const movieDetailQueryOptions = (
  movieId: number,
  enabled: boolean,
) =>
  queryOptions({
    queryKey: ['movies', 'detail', movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled,
    staleTime: 30 * 1000,
  })