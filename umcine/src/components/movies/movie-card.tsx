import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movies";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <li>
      {/* 포스터 크기와 모서리 */}
      <div className="relative aspect-[204/231] overflow-hidden rounded-lg bg-[#ddd]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          tabIndex={-1}
          aria-hidden="true"
          className="block size-full"
        >
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="block size-full object-cover"
          />
        </Link>

        {/* 북마크 버튼: 상태에 따라 달라지는 class는 cn으로 */}
        <button
          type="button"
          aria-pressed={movie.isBookmarked}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={() => onToggleBookmark(movie.id)}
          className={cn(
            "absolute top-2 right-2 grid size-7 cursor-pointer place-items-center rounded-md border p-0",
            movie.isBookmarked
              ? "border-[#2563EB] bg-[#2563EB]"
              : "border-white/85 bg-black/55",
          )}
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
            className="size-3.5 brightness-0 invert"
          />
        </button>
      </div>

      {/* 제목 */}
      <h2 className="mt-2.5 mb-1 text-left text-[13px] font-bold">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {movie.title}
        </Link>
      </h2>

      {/* 개봉일 */}
      <p className="m-0 text-left text-xs text-[#9ca3af]">{movie.releaseDate}</p>
    </li>
  );
}