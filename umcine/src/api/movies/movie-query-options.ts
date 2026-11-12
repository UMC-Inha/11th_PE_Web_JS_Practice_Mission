import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { getMovieDetail } from './get-movie-details'
import { getMovies } from './get-movies'
import { searchMovies } from './search-movies'
import { isHTTPError } from 'ky'


export const movieListQueryOptions = (page: number) =>
  queryOptions({
    queryKey: ['movies', 'list', { page }],
    queryFn: () => getMovies({ page }),
    placeholderData: keepPreviousData,
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

    retry: (failureCount, error) => {
      if (isHTTPError(error) && error.response.status === 404) {
        return false
      }

      return failureCount < 3
    },
  })