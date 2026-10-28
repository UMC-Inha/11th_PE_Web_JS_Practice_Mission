import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

interface MovieSearchCardProps {
  movie: TmdbMovieListItem;
}

export function MovieSearchCard({ movie }: MovieSearchCardProps) {
  return (
    <li
      className="flex gap-5 border-b border-[#DCE0E6] py-5"
    >
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="shrink-0"
      >
        {movie.poster_path ? (
          <img
            src={getTmdbPosterUrl(movie.poster_path) ?? undefined}
            alt={`${movie.title} 포스터`}
            className="h-[194px] w-[130px] rounded-[8px] object-cover"
          />
        ) : (
          <div className="flex h-[194px] w-[130px] items-center justify-center rounded-[8px] bg-gray-100 text-[13px] text-[#969DA8]">
            포스터 없음
          </div>
        )}
      </Link>

      <div className="min-w-0 flex-1 py-1">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          <h3 className="mb-2 text-[18px] font-bold">
            {movie.title}
          </h3>
        </Link>

        <div className="mb-3 flex flex-wrap gap-x-3 text-[13px] text-[#969DA8]">
          <span>{movie.original_title}</span>
          <span>{movie.release_date}</span>
        </div>

        <p className="mb-5 line-clamp-2 text-[14px] leading-[22px] text-[#697281]">
          {movie.overview}
        </p>

        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="text-[14px] font-bold text-blue-600"
        >
          상세 보기 →
        </Link>
      </div>
    </li>
  );
}
