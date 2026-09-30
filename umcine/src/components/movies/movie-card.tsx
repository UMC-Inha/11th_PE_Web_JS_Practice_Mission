import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="flex flex-col text-left">
      <div className="relative">
        {/* 1. 포스터 영역 (Link) */}
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block w-full h-full"
        >
          {movie.posterPath && (
            <img
              src={movie.posterPath}
              alt={movie.title}
              className="block w-full aspect-[2/3] object-cover rounded-[12px]"
            />
          )}
        </Link>
        
        {/* 2. 북마크 버튼 */}
        <button
          type="button"
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
          className={cn(
            "absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border-none cursor-pointer transition-colors",
            movie.isBookmarked ? "bg-blue-600" : "bg-black/55"
          )}
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
            className="w-4 h-4"
          />
        </button>
      </div>

      {/* 3. 제목 영역 (Link) */}
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="no-underline text-inherit group"
      >
        <h3 className="mt-3 mb-1 text-[16px] font-semibold text-[var(--text-h)] group-hover:text-blue-500 transition-colors">
          {movie.title}
        </h3>
      </Link>

      {/* 4. 개봉일 영역 */}
      <p className="m-0 text-[14px] text-[var(--text)]">
        개봉일: {movie.releaseDate}
      </p>
    </article>
  );
}