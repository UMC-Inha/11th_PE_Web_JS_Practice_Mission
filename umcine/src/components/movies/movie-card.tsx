import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movies";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
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

        {/* 북마크 버튼: 전역 store를 사용하는 공용 컴포넌트 */}
        <BookmarkButton movieId={movie.id} />
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