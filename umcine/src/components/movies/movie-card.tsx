import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative">
        <img
          className="h-[274px] w-full rounded-[10px] object-cover"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />

        <button
          type="button"
          className={cn(
            "absolute top-2.5 right-2.5 flex h-[34px] w-[34px] items-center justify-center rounded-lg border",
            movie.isBookmarked
              ? "border-blue-600 bg-blue-600"
              : "border-white bg-black/80",
          )}
          aria-label={`${movie.title} 북마크`}
          aria-pressed={movie.isBookmarked}
          onClick={() =>
            onToggleBookmark(movie.id)
          }
        >
          <img
            className="h-6 w-6 brightness-0 invert"
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>

      <Link
        to="/movies/$movieId"
        params={{
          movieId: String(movie.id),
        }}
      >
        <h2
          className="mt-2 truncate text-sm leading-5 font-bold"
          title={movie.title}
        >
          {movie.title}
        </h2>
      </Link>

      <p className="mt-0.5 text-xs leading-[18px] text-gray-400">
        {movie.releaseDate}
      </p>
    </article>
  );
}