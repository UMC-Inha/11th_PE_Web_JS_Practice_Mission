import type { ReactNode } from 'react'
import type { Movie } from '../../types/movie'
import { MovieCard } from './movie-card'

type MovieGridProps = {
  movies: Movie[]
  // 카드 아래에 추가로 보여줄 내용 (예: 내 정보 화면의 내 평점)
  renderExtra?: (movie: Movie) => ReactNode
}

export function MovieGrid({ movies, renderExtra }: MovieGridProps) {
  return (
    <ul className="grid grid-cols-5 gap-x-[18px] gap-y-[21px] self-stretch">
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} />
          {renderExtra?.(movie)}
        </li>
      ))}
    </ul>
  )
}
