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
    <article className="movie-card overflow-hidden rounded-[10px] bg-white min-w-0 group">
      <div className="poster-wrap relative aspect-2/3 overflow-hidden rounded-sm bg-[#dedce3]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block h-full"
        >
          {posterUrl ? (
            <img
              className="movie-poster block w-full h-full object-cover transition-transform duration-180 ease-[ease] group-hover:scale-[1.015]"
              src={posterUrl}
              alt={`${movie.title} 포스터`}
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs text-gray-500">
              이미지 없음
            </div>
          )}
        </Link>

        <BookmarkButton movieId={movie.id} />
      </div>

      <div className="movie-info pt-1.75">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          <h2 className="mb-1 truncate text-[11px] font-bold leading-[1.35] text-[#222]">
            {movie.title}
          </h2>
          <p className="m-0 text-[10px] text-[#8a8a8a]">
            {movie.release_date}
          </p>
        </Link>
      </div>
    </article>
  );
}