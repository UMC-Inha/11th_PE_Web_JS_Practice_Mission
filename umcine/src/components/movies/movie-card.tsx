import type { Movie } from "../../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="movie-card__poster">
        <img src={movie.posterPath} alt={movie.title} />
        <button
          className={movie.isBookmarked ? "movie-card__bookmark is-active" : "movie-card__bookmark"}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={movie.isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
            alt={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          />
        </button>
      </div>
      <h3 className="movie-card__title">{movie.title}</h3>
      <p className="movie-card__date">{movie.releaseDate}</p>
    </article>
  );
}