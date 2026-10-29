import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

const STARS = [1, 2, 3, 4, 5];

function formatRuntime(runtime: number | null) {
  if (!runtime) return "상영 시간 정보가 없어요.";

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(parsedMovieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  useEffect(() => {
    let ignore = false;

    if (!isValidMovieId) {
      setMovie(null);
      setIsLoading(false);
      return;
    }

    async function loadMovie() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovieDetail(parsedMovieId);
        if (!ignore) setMovie(response);
      } catch (error) {
        if (!ignore) {
          setMovie(null);
          setErrorMessage(getMovieDetailErrorMessage(error));
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovie();

    return () => {
      ignore = true;
    };
  }, [parsedMovieId, isValidMovieId]);

  if (!isValidMovieId) {
    return (
      <main className="flex flex-1 items-center justify-center py-24 text-sm text-gray-500">
        올바르지 않은 영화 번호예요.
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center py-24 text-sm text-gray-500">
        영화 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (errorMessage || !movie) {
    return (
      <main className="flex flex-1 items-center justify-center py-24 text-sm text-gray-500">
        {errorMessage ?? "영화 정보를 불러오지 못했어요."}
      </main>
    );
  }

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const genreNames = movie.genres.map((genre) => genre.name).join(", ");

  return (
    <main className="flex-1">
      <section className="relative h-90 overflow-hidden">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-300 text-sm text-gray-500">
            이미지 없음
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-360 flex-col justify-between px-20 py-8 text-white">
          <Link to="/" className="flex items-center gap-1 self-start text-xs font-semibold">
            <img src="/icons/chevron-left.svg" alt="" className="h-4 w-4 brightness-0 invert" />
            영화 목록
          </Link>

          <div>
            <h1 className="text-[44px] font-bold">{movie.title}</h1>
            <p className="mt-1 text-sm text-white/80">{movie.original_title}</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
              <span>{movie.release_date}</span>
              {genreNames && <span>{genreNames}</span>}
              <span>{formatRuntime(movie.runtime)}</span>
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-360 gap-10 px-20 py-10">
        <div className="flex flex-1 gap-8">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="aspect-2/3 w-50 shrink-0 rounded-xl object-cover shadow-lg"
            />
          ) : (
            <div className="flex aspect-2/3 w-50 shrink-0 items-center justify-center rounded-xl bg-gray-200 text-sm text-gray-500">
              이미지 없음
            </div>
          )}
          <div>
            {movie.tagline && <h2 className="text-lg font-bold">{movie.tagline}</h2>}
            <p className="mt-3 text-sm leading-6 text-gray-600">
              {movie.overview || "줄거리 정보가 없어요."}
            </p>
            <button
              type="button"
              onClick={() => toggleBookmark(movie.id)}
              className="mt-5 flex items-center gap-2 rounded-lg bg-[#4f5de8] px-4 py-2 text-sm font-semibold text-white"
            >
              <img
                src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
                alt=""
                className="h-4 w-4 brightness-0 invert"
              />
              북마크
            </button>
          </div>
        </div>

        <aside className="w-85 shrink-0 border-l border-gray-200 pl-10">
          <h2 className="text-base font-bold">내 평점</h2>
          <p className="mt-1 text-xs text-gray-400">별점은 필수, 후기는 선택이에요.</p>
          <div className="mt-3 flex gap-2">
            {STARS.map((star) => (
              <button
                key={star}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white"
              >
                <img src="/icons/star.svg" alt={`${star}점`} className="h-5 w-5 opacity-70" />
              </button>
            ))}
          </div>
          <textarea
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="mt-4 h-24 w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none placeholder:text-gray-400"
          />
          <button className="mt-3 w-full rounded-lg bg-[#111111] py-3 text-sm font-semibold text-white">
            평점 저장
          </button>
        </aside>
      </section>
    </main>
  );
}