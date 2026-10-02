import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  isBookmarked: boolean;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  isBookmarked,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="flex w-full flex-col items-start gap-1">
      <div className="relative h-[274px] w-full overflow-hidden rounded-[10px] bg-[#f6f7f9]">

        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          <img
            className="block h-full w-full object-cover"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>

        <button
          className={cn(
            "absolute right-[10px] top-[10px] flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[#17191e] p-[5px]",
            isBookmarked && "border-[#2563eb] bg-[#2563eb]",
          )}
          type="button"
          aria-label="북마크"
          aria-pressed={isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            className="h-6 w-6 brightness-0 invert"
            src={
              isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>

      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
      >
        <h2 className="w-full pt-[5px] font-[Pretendard,sans-serif] text-sm font-extrabold text-[#17191e]">
          {movie.title}
        </h2>
      </Link>

      <p className="w-full font-[Pretendard,sans-serif] text-xs font-normal text-[#969da8]">
        {movie.releaseDate}
      </p>
    </article>
  );
}