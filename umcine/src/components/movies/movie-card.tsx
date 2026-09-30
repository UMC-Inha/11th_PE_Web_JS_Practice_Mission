import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <li className="list-none text-left">
      <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-app-surface">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img
            className="block h-full w-full object-cover"
            src={movie.posterPath}
            alt={movie.title}
          />
        </Link>
        <button
          type="button"
          className={cn(
            "absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-md border-none bg-black/35",
            movie.isBookmarked && "bg-app-accent",
          )}
          aria-pressed={movie.isBookmarked}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            className="h-4 w-4 brightness-0 invert"
            src={movie.isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
            alt=""
            aria-hidden="true"
          />
        </button>
      </div>
      <div className="mt-2.5">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <p className="truncate text-[15px] font-bold text-app-text-h">
            {movie.title}
          </p>
        </Link>
        <p className="mt-1 text-[13px] text-app-text">{movie.releaseDate}</p>
      </div>
    </li>
  );
}

export default MovieCard;
