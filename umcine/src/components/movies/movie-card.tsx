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
    <article className="flex min-w-0 flex-col gap-1 xl:h-[318px]">
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="aspect-[241.6/274] w-full object-cover xl:h-[274px] xl:aspect-auto"
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

      <div className="h-[22px] pt-[5px]">
        <Link
          to="/movies/$movieId"
          params={{
            movieId: String(movie.id),
          }}
          className="block"
        >
          <h2
            title={movie.title}
            className="truncate text-sm leading-[17px] font-bold text-[#191B20]"
          >
            {movie.title}
          </h2>
        </Link>
      </div>

      <p className="h-3.5 text-xs leading-3.5 text-gray-400">
        {movie.releaseDate}
      </p>
    </article>
  );
}