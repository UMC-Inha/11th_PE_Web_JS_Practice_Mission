import { Link } from '@tanstack/react-router'
import type { Movie } from '../../types/movie'

interface MovieCardProps {
  movie: Movie
  onToggleBookmark: (movieId: number) => void
}

export default function MovieCard({
                                    movie,
                                    onToggleBookmark,
                                  }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img
            className="movie-poster"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>

        <button
          className="bookmark-button"
          type="button"
          onClick={() => onToggleBookmark(movie.id)}
          aria-pressed={movie.isBookmarked}
          aria-label={movie.isBookmarked ? '북마크 해제' : '북마크 추가'}
        >
          <img
            src={movie.isBookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'}
            alt=""
          />
        </button>
      </div>

      <h2 className="movie-title">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {movie.title}
        </Link>
      </h2>

      <p className="movie-release-date">{movie.releaseDate}</p>
    </article>
  )
}
