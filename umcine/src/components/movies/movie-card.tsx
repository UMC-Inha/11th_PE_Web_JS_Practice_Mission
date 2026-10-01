import type { Movie } from "../../types/movie";
import { Link } from "@tanstack/react-router";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  const { isBookmarked } = movie;

  return (
    <article className="movie-card">
      <div className="movie-card__poster">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img src={movie.posterPath} alt={`${movie.title} 포스터`} />
        </Link>
        <button
          type="button"
          className={`bookmark-button${isBookmarked ? " bookmark-button--active" : ""}`}
          aria-pressed={isBookmarked}
          aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
            alt=""
            width={14}
            height={14}
          />
        </button>
      </div>
      <h3 className="movie-card__title">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {movie.title}
        </Link>
      </h3>
      <p className="movie-card__date">{movie.releaseDate}</p>
    </article>
  );
}