import type { Movie } from '../../types/movie'
import { MovieCard } from './movie-card'

type MovieGridProps = {
  movies: Movie[]
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <ul className="grid grid-cols-5 gap-x-[18px] gap-y-[21px] self-stretch">
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} />
        </li>
      ))}
    </ul>
  )
}
