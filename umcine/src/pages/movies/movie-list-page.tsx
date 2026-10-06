import { useState } from 'react'
import MovieGrid from '../../components/movies/movie-grid'
import Pagination from '../../components/movies/pagination'
import { movies as initialMovies } from '../../data/movies'

export default function MovieListPage() {
  const [movies, setMovies] = useState(initialMovies)

  const toggleBookmark = (movieId: number) => {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId ? { ...movie, isBookmarked: !movie.isBookmarked } : movie,
      ),
    )
  }

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
