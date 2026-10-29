import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import PosterImage from "../../components/movies/poster-image";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";
import { formatRuntime } from "../../utils/movies/format-runtime";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

const RATING_VALUES = [1, 2, 3, 4, 5];

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("h-5 w-5", filled ? "text-app-accent" : "text-gray-400")}
    >
      <path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.58L12 17.77l-5.9 3.1 1.13-6.58L2.45 9.44l6.6-.96L12 2.5z" />
    </svg>
  );
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId =
    Number.isInteger(parsedMovieId) && parsedMovieId > 0;
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(isValidMovieId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(parsedMovieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadMovieDetail() {
      setMovie(null);
      setErrorMessage(null);

      if (!isValidMovieId) {
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

    loadMovieDetail();

    return () => {
      ignore = true;
    };
  }, [isValidMovieId, parsedMovieId]);

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
            to="/"
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
            onClick={() => toggleBookmark(movie.id)}
            className="mt-6 flex items-center gap-2 rounded-lg border-none bg-app-accent px-5 py-3 text-sm font-bold text-white"
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

        <div>
          <h2 className="text-lg font-bold text-app-text-h">내 평점</h2>
          <p className="mt-1 text-sm text-app-text">
            별점은 필수, 후기는 선택이에요.
          </p>
          <div className="mt-3 flex gap-2">
            {RATING_VALUES.map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`${value}점`}
                aria-pressed={rating === value}
                onClick={() => {
                  setRating(value);
                  setIsSaved(false);
                }}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-white"
              >
                <StarIcon filled={value <= rating} />
              </button>
            ))}
          </div>
          <textarea
            value={review}
            onChange={(event) => {
              setReview(event.target.value);
              setIsSaved(false);
            }}
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="mt-3 h-28 w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-sm text-app-text-h outline-none placeholder:text-gray-400"
          />
          <button
            type="button"
            disabled={rating === 0}
            onClick={() => setIsSaved(true)}
            className="mt-3 w-full rounded-lg border-none bg-gray-900 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaved ? "저장했어요!" : "평점 저장"}
          </button>
        </div>
      </div>
    </main>
  );
}
