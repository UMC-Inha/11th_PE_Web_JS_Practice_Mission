import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="flex flex-col text-left">
      <div className="relative">
        {/* 포스터 영역 (Link) */}
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
        
        {/* 북마크 버튼: useBookmarkStore(zustand)를 직접 구독/토글하는 BookmarkButton으로 교체 */}
        <BookmarkButton movieId={movie.id} />
      </div>
      

      {/* 제목 영역 (Link) */}
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="no-underline text-inherit group"
      >
        <h3 className="mt-3 mb-1 text-base font-semibold text-gray-900 group-hover:text-blue-500 transition-colors">
          {movie.title}
        </h3>
      </Link>

      {/* 개봉일 영역 */}
      <p className="m-0 text-sm text-gray-500">
        개봉일: {movie.releaseDate}
      </p>
    </article>
  );
}