import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

type MovieCardProps = {
  movie: Movie;
  isBookmarked: boolean;
  onToggleBookmark: (movieId: number) => void;
};

export function MovieCard({ movie, isBookmarked, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="relative flex flex-col gap-1">
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="flex flex-col gap-1"
      >
        <div className="h-[274px] overflow-hidden rounded-[10px] bg-[#F6F7F9]">
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="size-full object-cover"
          />
        </div>
        <div className="pt-[5px]">
          <p className="truncate text-sm leading-[17px] font-extrabold text-[#17191E]">
            {movie.title}
          </p>
        </div>
        <div>
          <p className="text-xs leading-[14px] text-[#969DA8]">{movie.releaseDate}</p>
        </div>
      </Link>

      <button
        type="button"
        aria-label={isBookmarked ? "북마크 해제" : "북마크"}
        aria-pressed={isBookmarked}
        onClick={() => onToggleBookmark(movie.id)}
        className={cn(
          "absolute top-[10px] right-[10px] flex size-[34px] cursor-pointer items-center justify-center rounded-lg border text-white",
          isBookmarked ? "border-[#2563EB] bg-[#2563EB]" : "border-white bg-[#17191E]",
        )}
      >
        <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden="true">
          {isBookmarked ? (
            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
          ) : (
            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15-5-2.18L7 18V5h10v13z" />
          )}
        </svg>
      </button>
    </article>
  );
}
