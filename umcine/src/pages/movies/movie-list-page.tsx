import MovieGrid from '../../components/movies/movie-grid'
import Pagination from '../../components/movies/pagination'
import { movies as initialMovies } from '../../data/movies'
import { useBookmarkStore } from '../../stores/bookmark-store'

export default function MovieListPage() {
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  )
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark)

  const movies = initialMovies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarkedMovieIds.includes(movie.id),
  }))

  return (
    <main className="mx-auto w-full max-w-[1100px] px-5 pb-20 pt-8 sm:px-10">
      <h1 className="mb-6 text-[28px] font-bold leading-tight text-[#17191e]">
        영화 목록
      </h1>

      <MovieGrid movies={movies} onToggleBookmark={toggleBookmark} />
      <Pagination />
    </main>
  )
}