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
            // rounded-[12px] -> rounded-xl (Tailwind 스케일에 12px와 정확히 일치하는 클래스가 있어 임의값 대신 사용)
            <img
              src={movie.posterPath}
              alt={movie.title}
              className="block w-full aspect-[2/3] object-cover rounded-xl"
            />
          )}
        </Link>
        
        {/* 2. 북마크 버튼 */}
        <button
          type="button"
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
          className={cn(
            // h-8 w-8 -> size-8 (가로·세로가 같을 때 size-* 하나로 축약)
            "absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-lg border-none cursor-pointer transition-colors",
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
            className="size-4" // w-4 h-4 -> size-4
          />
        </button>
      </div>

      {/* 3. 제목 영역 (Link) */}
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="no-underline text-inherit group"
      >
        {/* text-[16px] -> text-base, text-[var(--text-h)] -> text-gray-900
            (index.css에서 --text-h 커스텀 변수가 삭제돼 깨져 있던 참조라 Tailwind 기본 팔레트로 교체) */}
        <h3 className="mt-3 mb-1 text-base font-semibold text-gray-900 group-hover:text-blue-500 transition-colors">
          {movie.title}
        </h3>
      </Link>

      {/* 4. 개봉일 영역 */}
      {/* text-[14px] -> text-sm, text-[var(--text)] -> text-gray-500 (같은 이유) */}
      <p className="m-0 text-sm text-gray-500">
        개봉일: {movie.releaseDate}
      </p>
    </article>
  );
}