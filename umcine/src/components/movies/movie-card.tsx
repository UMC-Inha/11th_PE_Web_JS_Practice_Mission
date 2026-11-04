import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <article className="relative flex min-w-0 flex-col gap-1 xl:h-[318px]">
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        aria-label={`${movie.title} 상세 보기`}
        className="flex min-w-0 flex-col gap-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <div className="aspect-[241.6/274] w-full overflow-hidden rounded-lg bg-gray-200 xl:h-[274px] xl:aspect-auto">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              이미지 없음
            </div>
          )}
        </div>

        <div className="h-[22px] pt-[5px]">
          <h2
            title={movie.title}
            className="truncate text-sm leading-[17px] font-bold text-[#191B20]"
          >
            {movie.title}
          </h2>
        </div>
      </Link>

      <BookmarkButton movieId={movie.id} movieTitle={movie.title} iconOnly />

      <p className="h-3.5 text-xs leading-3.5 text-gray-400">
        {movie.release_date || "개봉일 정보 없음"}
      </p>
    </article>
  );
}