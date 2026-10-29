import { useEffect, useState } from 'react'
import { getMovies } from '../../api/movies/get-movies'
import type { TmdbMovieListItem } from '../../api/movies/models'
import MovieGrid from '../../components/movies/movie-grid'
import Pagination from '../../components/movies/pagination'
import { useBookmarkStore } from '../../stores/bookmark-store'
import type { Movie } from '../../types/movie'
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from '../../utils/movies/tmdb-image'

export default function MovieListPage() {
  const [tmdbMovies, setTmdbMovies] = useState<TmdbMovieListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  )
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark)

  useEffect(() => {
    let ignore = false

    async function loadMovies() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const response = await getMovies({ page: 1 })

        if (!ignore) {
          setTmdbMovies(response.results)
        }
      } catch {
        if (!ignore) {
          setErrorMessage('영화 목록을 불러오지 못했어요.')
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    loadMovies()

    return () => {
      ignore = true
    }
  }, [])

  const movies: Movie[] = tmdbMovies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: movie.release_date,
    posterPath: getTmdbPosterUrl(movie.poster_path),
    backdropPath: getTmdbBackdropUrl(movie.backdrop_path),
    genres: [],
    runtime: '',
    tagline: '',
    overview: movie.overview,
    isBookmarked: bookmarkedMovieIds.includes(movie.id),
  }))

  return (
    <main className="mx-auto w-full max-w-[1100px] px-5 pb-20 pt-8 sm:px-10">
      <h1 className="mb-6 text-[28px] font-bold leading-tight text-[#17191e]">
        영화 목록
      </h1>

      {isLoading ? (
        <p className="py-16 text-center text-sm text-[#606774]">
          영화 목록을 불러오는 중이에요.
        </p>
      ) : errorMessage ? (
        <p className="py-16 text-center text-sm text-[#dc2626]">
          {errorMessage}
        </p>
      ) : movies.length === 0 ? (
        <p className="py-16 text-center text-sm text-[#606774]">
          조건에 맞는 영화가 없어요.
        </p>
      ) : (
        <MovieGrid movies={movies} onToggleBookmark={toggleBookmark} />
      )}

      <Pagination />
    </main>
  )
}