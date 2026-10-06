import { useEffect, useState } from 'react'
import MovieGrid from '../../components/movies/movie-grid'
import Pagination from '../../components/movies/pagination'
import { movies as initialMovies } from '../../data/movies'
import { readBookmarkIds, saveBookmarkIds } from '../../utils/bookmark-storage'

export default function MovieListPage() {
  const [bookmarkIds, setBookmarkIds] = useState<number[]>(() => readBookmarkIds())

  useEffect(() => {
    saveBookmarkIds(bookmarkIds)
  }, [bookmarkIds])

  const movies = initialMovies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarkIds.includes(movie.id),
  }))

  const toggleBookmark = (movieId: number) => {
    setBookmarkIds((currentIds) =>
      currentIds.includes(movieId)
        ? currentIds.filter((id) => id !== movieId)
        : [...currentIds, movieId],
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