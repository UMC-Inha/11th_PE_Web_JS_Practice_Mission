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
      <div className="relative aspect-[241.6/274] w-full overflow-hidden rounded-[7px] bg-[#ddd]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block h-full"
        >
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="block h-full w-full object-cover"
          />
        </Link>

        <button
          type="button"
          className={cn(
            "absolute right-2.25 top-2.25 flex h-8 w-8 items-center justify-center rounded-md border border-white p-0",
            movie.isBookmarked ? "bg-[#2864dc]" : "bg-black/55",
          )}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={
              movie.isBookmarked
                ? "/movie-icons/bookmark.svg"
                : "/movie-icons/bookmark-outline.svg"
            }
            alt=""
            className="h-5 w-5 brightness-0 invert"
          />
        </button>
      </div>

      <h2 className="mt-2.25 mb-1 truncate text-left text-[13px] font-bold">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="text-inherit no-underline"
        >
          {movie.title}
        </Link>
      </h2>

      <p className="m-0 text-left text-[11px] text-[#999]">
        {movie.releaseDate}
      </p>
    </article>
  );
}
