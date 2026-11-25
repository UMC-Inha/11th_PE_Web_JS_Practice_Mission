"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { isHTTPError } from "ky";
import MovieRatingSection from "../../components/movies/movie-rating-section";
import PosterImage from "../../components/movies/poster-image";
import { useToggleFavoriteMutation } from "../../hooks/use-toggle-favorite-mutation";
import { favoriteStatusQueryOptions } from "../../queries/favorite-queries";
import { movieDetailQueryOptions } from "../../queries/movie-queries";
import { useAuthStore } from "../../stores/auth-store";
import { formatRuntime } from "../../utils/movies/format-runtime";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

interface MovieDetailPageProps {
  movieId: string;
}

export function MovieDetailPage({ movieId }: MovieDetailPageProps) {
  const parsedMovieId = Number(movieId);
  const isValidMovieId =
    Number.isInteger(parsedMovieId) && parsedMovieId > 0;
  const {
    data: movie,
    isPending,
    error,
  } = useQuery({
    ...movieDetailQueryOptions(parsedMovieId),
    enabled: isValidMovieId,
    // 존재하지 않는 영화(404)는 다시 시도해도 같은 결과라 재시도하지 않음.
    retry: (failureCount, err) =>
      !(isHTTPError(err) && err.response.status === 404) && failureCount < 1,
  });
  const isLoading = isValidMovieId && isPending;
  const errorMessage = error ? getMovieDetailErrorMessage(error) : null;
  const isLoggedIn = useAuthStore((state) => state.accessToken !== null);
  const { data: isFavorite } = useQuery(
    favoriteStatusQueryOptions(parsedMovieId, isLoggedIn && isValidMovieId),
  );
  const isBookmarked = isLoggedIn && Boolean(isFavorite);
  const { toggle: toggleFavorite, isPending: isTogglingFavorite } =
    useToggleFavoriteMutation();

  if (!isValidMovieId || isLoading || errorMessage || !movie) {
    return (
      <main className="mx-auto w-full max-w-[1126px] flex-1 px-6 py-8 pb-16">
        {!isValidMovieId ? (
          "올바르지 않은 영화 번호예요."
        ) : isLoading ? (
          <p role="status">영화 정보를 불러오는 중이에요.</p>
        ) : (
          <p role="alert">{errorMessage}</p>
        )}
      </main>
    );
  }

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  return (
    <main className="flex-1">
      <section className="relative h-[280px] w-full overflow-hidden bg-gray-900 sm:h-[389px]">
        {backdropUrl ? (
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={backdropUrl}
            alt=""
            aria-hidden="true"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-sm text-gray-500">
            이미지 없음
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-[1126px] flex-col justify-between px-6 py-6">
          <Link
            href="/"
            className="flex w-fit items-center gap-1 text-sm text-white no-underline"
          >
            <img
              className="h-4 w-4 invert"
              src="/icons/chevron-left.svg"
              alt=""
              aria-hidden="true"
            />
            영화 목록
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-white sm:text-[36px]">
              {movie.title}
            </h1>
            <p className="mt-1 text-base text-gray-200">
              {movie.original_title}
            </p>
            <p className="mt-2 flex flex-wrap gap-3 text-sm text-gray-200">
              <span>{movie.release_date || "개봉일 미정"}</span>
              <span>{movie.genres.map((genre) => genre.name).join(", ")}</span>
              <span>{formatRuntime(movie.runtime)}</span>
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-[1126px] grid-cols-1 gap-10 px-6 py-8 pb-16 lg:grid-cols-[215px_1fr_280px]">
        <PosterImage
          className="aspect-2/3 w-full max-w-[215px] rounded-lg object-cover"
          src={getTmdbPosterUrl(movie.poster_path)}
          alt={`${movie.title} 포스터`}
        />

        <div>
          <h2 className="text-xl font-bold text-app-text-h">
            {movie.tagline}
          </h2>
          <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-app-text">
            {movie.overview}
          </p>
          <button
            type="button"
            aria-pressed={isBookmarked}
            disabled={isTogglingFavorite}
            onClick={() => toggleFavorite(movie.id, isBookmarked)}
            className="mt-6 flex items-center gap-2 rounded-lg border-none bg-app-accent px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <img
              className="h-4 w-4 invert"
              src={
                isBookmarked
                  ? "/icons/bookmark.svg"
                  : "/icons/bookmark-outline.svg"
              }
              alt=""
              aria-hidden="true"
            />
            즐겨찾기
          </button>
        </div>

        <MovieRatingSection movieId={movie.id} />
      </div>
    </main>
  );
}
