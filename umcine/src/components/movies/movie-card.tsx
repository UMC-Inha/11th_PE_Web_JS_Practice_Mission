import type { Movie } from "../../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <img
          className="movie-poster"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />

<button
  className={`bookmark-button ${
    movie.isBookmarked ? "bookmarked" : ""
  }`}
  type="button"
  aria-label="북마크"
  aria-pressed={movie.isBookmarked}
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

      <h2 className="movie-title">{movie.title}</h2>
      <p className="movie-release-date">{movie.releaseDate}</p>
    </article>
  );
}