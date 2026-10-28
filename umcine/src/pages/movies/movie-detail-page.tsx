import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { BookmarkButton } from "../../components/bookmark-button";
import { MovieRatingForm } from "../../components/movies/movie-rating-form";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";
import { cn } from "../../utils/cn";

const containerClass = "mx-auto w-[min(1080px,100%_-_48px)]";

function formatRuntime(runtime: number | null) {
  if (runtime === null) {
    return "상영 시간 정보가 없어요.";
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) {
    return `${minutes}분`;
  }

  return `${hours}시간 ${minutes}분`;
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    setMovie(null);
    setErrorMessage(null);

    if (!isValidMovieId) {
      setErrorMessage("올바르지 않은 영화 번호예요.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    async function loadMovieDetail() {
      try {
        const response = await getMovieDetail(parsedMovieId);
        if (!ignore) setMovie(response);
      } catch (error) {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovieDetail();

    return () => {
      ignore = true;
    };
  }, [parsedMovieId, isValidMovieId]);

  if (isLoading) {
    return (
      <main className={cn(containerClass, "py-20")}>
        <p className="text-center text-sm text-[#888]">
          영화 정보를 불러오는 중이에요.
        </p>
      </main>
    );
  }

  if (errorMessage || !movie) {
    return (
      <main className={cn(containerClass, "py-20")}>
        <p className="text-center text-sm text-[#888]">
          {errorMessage ?? "영화 정보를 불러오지 못했어요."}
        </p>
        <div className="mt-4 text-center">
          <Link to="/" className="text-xs font-bold text-[#2563EB]">
            영화 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <main>
      <section className="relative h-[300px] overflow-hidden bg-[#111] text-white">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover"
          />
        )}
        {/* 글자가 잘 보이도록 왼쪽·아래쪽을 어둡게 */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent to-60%"
        />

        <div
          className={cn(
            containerClass,
            "relative flex h-full flex-col justify-between pt-5 pb-7",
          )}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1 self-start text-xs font-bold text-white"
          >
            <img
              src="/icons/chevron-left.svg"
              alt=""
              className="size-3.5 brightness-0 invert"
            />
            영화 목록
          </Link>

          <div>
            <h1 className="mb-2 text-4xl font-extrabold text-white">
              {movie.title}
            </h1>
            <p className="mb-2 text-xs">{movie.original_title}</p>
            <p className="flex flex-wrap gap-2 text-xs font-bold">
              <span>{movie.release_date}</span>
              <span>{movie.genres.map((genre) => genre.name).join(", ")}</span>
              <span>{formatRuntime(movie.runtime)}</span>
            </p>
          </div>
        </div>
      </section>

      <div
        className={cn(
          containerClass,
          "flex flex-col gap-8 pt-5 pb-[60px] lg:flex-row",
        )}
      >
        <section className="flex flex-1 flex-col items-start gap-7 sm:flex-row">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="aspect-[2/3] w-[168px] shrink-0 rounded-lg object-cover shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
            />
          ) : (
            <div className="grid aspect-[2/3] w-[168px] shrink-0 place-items-center rounded-lg bg-[#e5e7eb] text-xs text-[#9ca3af]">
              이미지 없음
            </div>
          )}
          <div>
            <h2 className="mb-3 text-[17px] font-extrabold">{movie.tagline}</h2>
            <p className="text-xs leading-[1.8] whitespace-pre-line text-[#555]">
              {movie.overview}
            </p>
            <BookmarkButton movieId={movie.id} variant="label" />
          </div>
        </section>

        <aside className="shrink-0 lg:w-[276px] lg:border-l lg:border-[#e5e7eb] lg:pl-6">
          <MovieRatingForm key={movie.id} />
        </aside>
      </div>
    </main>
  );
}