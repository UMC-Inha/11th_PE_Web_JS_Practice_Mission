import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onBookmarkToggle: (movieId: number) => void;
}

export function MovieCard({ movie, onBookmarkToggle }: MovieCardProps) {
  const bookmarkIcon = movie.isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg";
  const bookmarkLabel = movie.isBookmarked ? "북마크 해제" : "북마크 추가";

  return (
    <article className="movie-card">
      <div className="poster-wrap">
        <img className="movie-poster" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        <button className="bookmark-button" type="button" onClick={() => onBookmarkToggle(movie.id)} aria-label={`${movie.title} ${bookmarkLabel}`} aria-pressed={movie.isBookmarked}>
          <img src={bookmarkIcon} alt="" />
        </button>
      </div>
      <div className="movie-info">
        <h2>{movie.title}</h2>
        <p>{movie.releaseDate}</p>
      </div>
    </article>
  );
}
