import type { Movie } from "../../types/movie";
import styles from "./movie-card.module.css";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.posterWrapper}>
        {movie.posterPath && (
          <img
            src={movie.posterPath}
            alt={movie.title}
            className={styles.poster}
          />
        )}

        <button
          type="button"
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
          className={
            movie.isBookmarked
              ? `${styles.bookmarkButton} ${styles.bookmarkButtonActive}`
              : styles.bookmarkButton
          }
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
            className={styles.bookmarkIcon}
          />
        </button>
      </div>

      <h3 className={styles.title}>{movie.title}</h3>
      <p className={styles.date}>개봉일: {movie.releaseDate}</p>
    </article>
  );
}
