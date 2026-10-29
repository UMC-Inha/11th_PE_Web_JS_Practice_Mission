import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tmdb-image";

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

    setMovie(null);
    setErrorMessage(null);

    if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    async function loadMovie() {
      try {
        const response = await getMovieDetail(parsedMovieId);
        if (!ignore) setMovie(response);
      } catch (error) {
        if (!ignore) {
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
  }, [parsedMovieId]);

  if (!isValidMovieId) {
    return <main>올바르지 않은 영화 번호예요.</main>;
  }

  if (isLoading) {
    return <main>영화 정보를 불러오는 중이에요.</main>;
  }

  if (errorMessage) {
    return <main>{errorMessage}</main>;
  }

  if (!movie) {
    return <main>영화 정보를 불러오지 못했어요.</main>;
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  const runtimeText =
    movie.runtime === null
      ? "상영 시간 정보가 없어요."
      : `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`;

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative h-90 overflow-hidden">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gray-300">
            이미지 없음
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col px-5 py-7 text-white">
          <Link to="/" className="text-sm">
            〈 영화 목록
          </Link>
          <div className="mt-auto">
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <p className="mt-2 text-sm">{movie.original_title}</p>
            <p className="mt-2 text-sm">
              {movie.release_date}
              {" · "}
              {movie.genres.map((genre) => genre.name).join(" · ")}
              {" · "}
              {runtimeText}
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-[240px_minmax(0,1fr)_320px] gap-8 px-5 py-12">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${movie.title} 포스터`}
            className="h-90 w-60 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div className="grid h-90 w-60 shrink-0 place-items-center rounded-xl bg-gray-300">
            이미지 없음
          </div>
        )}

        <div className="min-w-0">
          <h2 className="text-2xl font-bold">{movie.tagline}</h2>
          <p className="mt-6 leading-7">{movie.overview}</p>
          <button
            type="button"
            className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white"
            aria-pressed={isBookmarked}
            onClick={() => toggleBookmark(movie.id)}
          >
            <img
              src={
                isBookmarked
                  ? "/icons/bookmark.svg"
                  : "/icons/bookmark-outline.svg"
              }
              alt=""
              className="size-5 invert"
            />
            {isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
          </button>
        </div>
        <aside>
          <h2 className="m-0 text-lg font-bold">내 평점</h2>
          <p className="mt-2 text-xs text-gray-500">
            별점을 선택하고, 후기도 남겨보세요.
          </p>
          <div className="mt-3 flex gap-2" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <span
                key={index}
                className="grid size-9 place-items-center rounded bg-[#ededf0]"
              >
                <img
                  src="/icons/star.svg"
                  alt=""
                  className="size-5 opacity-60"
                />
              </span>
            ))}
          </div>
          <div className="mt-3 h-25 rounded-md border border-[#e6e6e8] bg-white p-3 text-xs text-[#aaa]">
            영화를 보고 느낀 점을 남겨보세요.
          </div>
          <div className="mt-2 grid h-10 place-items-center rounded-md bg-[#1b1b22] text-sm font-semibold text-white">
            평점 저장
          </div>
        </aside>
      </section>
    </main>
  );
}
