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
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="aspect-[4/5] w-full object-cover"
        />

        <button
          type="button"
          aria-label={`${movie.title} 북마크`}
          aria-pressed={movie.isBookmarked}
          onClick={() =>
            onToggleBookmark(movie.id)
          }
          className={cn(
            "absolute top-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-lg border",
            movie.isBookmarked
              ? "border-blue-600 bg-blue-600"
              : "border-white bg-[#191B20]/85",
          )}
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
            className="h-6 w-6 brightness-0 invert"
          />
        </button>
      </div>

      <Link
        to="/movies/$movieId"
        params={{
          movieId: String(movie.id),
        }}
        className="mt-2 block"
      >
        <h2
          title={movie.title}
          className="truncate text-sm font-bold text-[#191B20]"
        >
          {movie.title}
        </h2>
      </Link>

      <p className="mt-1 text-xs text-gray-400">
        {movie.releaseDate}
      </p>
    </article>
  );
}