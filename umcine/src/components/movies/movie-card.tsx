import type { Movie } from "../../types/movie";
import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img src={movie.posterPath} alt={movie.title} className="h-[274px] w-full rounded-[10px] object-cover" />
        </Link>
        <button
          type="button"
          className={cn(
            "absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-[10px]",
            movie.isBookmarked
              ? "bg-blue-600"
              : "bg-[#202124]",
            )}
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
            className="brightness-0 invert"
          />
        </button>
      </div>

        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <h2 className="w-full mt-[8px] text-[14px] font-bold">
            {movie.title}
          </h2>
        </Link>

      <p className="m-0 text-[12px] text-[#969DA8]">
        {movie.releaseDate}
      </p>
    </article>
  );
}