import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { movieListQueryOptions } from '../../api/movies/movie-query-options'
import type { TmdbMovieListItem } from '../../api/movies/models'
import MovieGrid from '../../components/movies/movie-grid'
import Pagination from '../../components/movies/pagination'
import { useBookmarkStore } from '../../stores/bookmark-store'
import type { Movie } from '../../types/movie'
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from '../../utils/movies/tmdb-image'

function toMovie(
  tmdbMovie: TmdbMovieListItem,
  isBookmarked: boolean,
): Movie {
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title,
    originalTitle: tmdbMovie.original_title,
    releaseDate: tmdbMovie.release_date,
    posterPath: getTmdbPosterUrl(tmdbMovie.poster_path),
    backdropPath: getTmdbBackdropUrl(tmdbMovie.backdrop_path),
    genres: [],
    runtime: '',
    tagline: '',
    overview: tmdbMovie.overview,
    isBookmarked,
  }
}

export default function MovieListPage() {
  const [page, setPage] = useState(1)

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  )
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark)

  const moviesQuery = useQuery(movieListQueryOptions(page))

  const tmdbMovies = moviesQuery.data?.results ?? []
  const totalPages = moviesQuery.data?.total_pages ?? 0

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
  }

  const movies = tmdbMovies.map((movie) =>
    toMovie(movie, bookmarkedMovieIds.includes(movie.id)),
  )

  return (
    <main className="mx-auto w-full max-w-[1100px] px-5 pb-20 pt-8 sm:px-10">
      <h1 className="mb-6 text-[28px] font-bold leading-tight text-[#17191e]">
        영화 목록
      </h1>

      {moviesQuery.isPending ? (
        <p className="py-16 text-center text-sm text-[#606774]">
          영화 목록을 불러오는 중이에요.
        </p>
      ) : moviesQuery.isError ? (
        <p className="py-16 text-center text-sm text-[#dc2626]">
          영화 목록을 불러오지 못했어요.
        </p>
      ) : movies.length === 0 ? (
        <p className="py-16 text-center text-sm text-[#606774]">
          조건에 맞는 영화가 없어요.
        </p>
      ) : (
        <MovieGrid movies={movies} onToggleBookmark={toggleBookmark} />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </main>
  )
}