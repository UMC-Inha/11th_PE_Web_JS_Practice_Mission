import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movies";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <li className="movie-card">
      <div className="movie-card__poster">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          tabIndex={-1}
          aria-hidden="true"
        >
          <img src={movie.posterPath} alt={`${movie.title} 포스터`} />
        </Link>
        <button
          type="button"
          className="movie-card__bookmark"
          aria-pressed={movie.isBookmarked}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>
      <h2 className="movie-card__title">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {movie.title}
        </Link>
      </h2>
      <p className="movie-card__date">{movie.releaseDate}</p>
    </li>
  );
}