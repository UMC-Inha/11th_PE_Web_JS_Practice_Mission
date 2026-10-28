import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { BookmarkButton } from "../../components/bookmark-button";
import RatingPanel from "../../components/movies/rating-panel";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadMovie() {
      setMovie(null);
      setErrorMessage(null);

      if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
        setErrorMessage("올바르지 않은 영화 번호예요.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await getMovieDetail(parsedMovieId);
        if (!ignore) setMovie(response);
      } catch (error) {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovie();

    return () => {
      ignore = true;
    };
  }, [parsedMovieId]);

  if (isLoading) {
    return (
      <main className="w-full flex-1 px-5 py-12 xl:px-20">
        <p role="status" className="text-sm text-gray-500">
          영화 정보를 불러오는 중이에요.
        </p>
      </main>
    );
  }

  if (errorMessage || !movie) {
    return (
      <main className="w-full flex-1 px-5 py-12 xl:px-20">
        <h1 role="alert" className="text-2xl font-bold">
          {errorMessage || "영화를 찾을 수 없어요."}
        </h1>
        <Link to="/" className="mt-5 inline-block text-blue-600 underline">
          영화 목록으로
        </Link>
      </main>
    );
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const runtimeText =
    typeof movie.runtime === "number"
      ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
      : "상영 시간 정보가 없어요.";

  return (
    <main className="flex w-full flex-1 flex-col bg-[#F6F7F9]">
      <section className="relative h-90 w-full shrink-0 overflow-hidden bg-gray-600 text-white">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-200">
            이미지 없음
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />

        <div className="relative flex h-full w-full flex-col justify-between px-5 py-6 xl:px-20">
          <Link
            to="/"
            className="flex w-fit items-center gap-2 text-sm font-semibold"
          >
            <span>‹</span>
            영화 목록
          </Link>
          <div>
            <h1 className="text-4xl leading-[44px] font-bold tracking-tight">
              {movie.title}
            </h1>
            <p className="mt-2 text-sm text-gray-200">
              {movie.original_title}
            </p>
            <p className="mt-2 text-sm font-semibold">
              {movie.release_date || "개봉일 정보 없음"}
              {" · "}
              {movie.genres.map((genre) => genre.name).join(", ") ||
                "장르 정보 없음"}
              {" · "}
              {runtimeText}
            </p>
          </div>
        </div>
      </section>

      <section className="flex w-full flex-col gap-6 px-5 py-6 xl:min-h-[342px] xl:flex-row xl:px-20">
        <div className="w-50 shrink-0">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="h-70 w-50 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-70 w-50 items-center justify-center rounded-lg bg-gray-200 text-sm text-gray-500">
              이미지 없음
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {movie.tagline && (
            <h2 className="text-xl font-bold">{movie.tagline}</h2>
          )}
          <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-500">
            {movie.overview || "줄거리 정보가 없어요."}
          </p>
          <div className="mt-6">
            <BookmarkButton movieId={movie.id} movieTitle={movie.title} />
          </div>
        </div>

        <div className="w-full shrink-0 xl:w-80 xl:border-l xl:border-gray-200 xl:pl-6">
          <RatingPanel key={movie.id} />
        </div>
      </section>
    </main>
  );
}