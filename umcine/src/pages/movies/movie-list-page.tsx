import { useState } from 'react'
import { MovieGrid } from '../../components/movies/movie-grid'
import { Pagination } from '../../components/movies/pagination'
import { movies } from '../../data/movies'

const MOVIES_PER_PAGE = 10

export function MovieListPage() {
  const [page, setPage] = useState(1)
  const [bookmarkedIds, setBookmarkedIds] = useState(
    () => new Set(movies.filter((movie) => movie.isBookmarked).map((movie) => movie.id)),
  )

  const totalPages = Math.max(1, Math.ceil(movies.length / MOVIES_PER_PAGE))
  const pagedMovies = movies.slice((page - 1) * MOVIES_PER_PAGE, page * MOVIES_PER_PAGE)

  const toggleBookmark = (movieId: number) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev)
      if (next.has(movieId)) {
        next.delete(movieId)
      } else {
        next.add(movieId)
      }
      return next
    })
  }

  return (
    <main className="mx-auto flex max-w-[1440px] flex-col items-start gap-5 px-20 py-6">
      <h1 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-[#17191E]">
        영화 목록
      </h1>
      <MovieGrid
        movies={pagedMovies}
        bookmarkedIds={bookmarkedIds}
        onToggleBookmark={toggleBookmark}
      />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </main>
  )
}
