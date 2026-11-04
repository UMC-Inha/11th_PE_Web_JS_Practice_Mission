import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <li>
      <div className="relative aspect-[204/231] overflow-hidden rounded-lg bg-[#ddd]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          tabIndex={-1}
          aria-hidden="true"
          className="block size-full"
        >
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="block size-full object-cover"
            />
          ) : (
            <div className="grid size-full place-items-center bg-[#e5e7eb] text-xs text-[#9ca3af]">
              이미지 없음
            </div>
          )}
        </Link>

        <BookmarkButton movieId={movie.id} />
      </div>

      <h2 className="mt-2.5 mb-1 text-left text-[13px] font-bold">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {movie.title}
        </Link>
      </h2>

      <p className="m-0 text-left text-xs text-[#9ca3af]">
        {movie.release_date}
      </p>
    </li>
  );
}