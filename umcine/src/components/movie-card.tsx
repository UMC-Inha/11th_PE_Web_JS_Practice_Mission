import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <img src={movie.posterPath} alt={movie.title} className="movie-poster" />

        <button
          type="button"
          className="bookmark-button"
          onClick={() => onToggleBookmark(movie.id)}
          aria-pressed={movie.isBookmarked}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
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

      <h2 className="movie-title">
        {movie.title}
      </h2>

      <p className="movie-date">
        {movie.releaseDate}
      </p>
    </article>
  );
}