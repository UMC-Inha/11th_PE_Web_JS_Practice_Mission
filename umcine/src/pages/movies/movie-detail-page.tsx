import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { BookmarkButton } from "../../components/bookmark-button";
import { MovieReview } from "../../components/movies/movie-review";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- 새 영화 요청 전에 이전 상세 정보를 초기화해요.
    setMovie(null);
    setErrorMessage(null);

    if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
      setErrorMessage("올바르지 않은 영화 번호예요.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    getMovieDetail(parsedMovieId)
      .then((response) => {
        if (!ignore) setMovie(response);
      })
      .catch((error: unknown) => {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [parsedMovieId]);

  if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
    return <main role="alert" className="px-[5.5%] py-10">올바르지 않은 영화 번호예요.</main>;
  }

  if (isLoading) {
    return <main role="status" className="px-[5.5%] py-10">영화 정보를 불러오는 중이에요.</main>;
  }

  if (errorMessage) {
    return <main role="alert" className="px-[5.5%] py-10">{errorMessage}</main>;
  }

  if (!movie) {
    return <main className="px-[5.5%] py-10">영화를 찾을 수 없어요.</main>;
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const runtimeText = typeof movie.runtime === "number"
    ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
    : "상영 시간 정보가 없어요.";

  return (
    <>
      <main className="bg-[#f6f7f9]">
        <section className="relative h-[360px] overflow-hidden bg-[#17191e]">
          {backdropUrl && (
            <img src={backdropUrl} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <Link to="/" className="absolute left-[5.5%] top-6 z-10 flex items-center gap-2 text-[13px] font-bold text-white">
            <img src="/icons/chevron-left.svg" alt="" className="h-5 w-5 brightness-0 invert" />
            영화 목록
          </Link>
          <div className="absolute bottom-6 left-[5.5%] right-[5.5%] z-10 text-white">
            <h1 className="text-[32px] font-bold leading-tight tracking-[-2.3px] sm:text-[46px]">{movie.title}</h1>
            <p className="mb-2 mt-3 text-sm">{movie.original_title}</p>
            <div className="flex flex-wrap gap-2 text-[13px] font-bold">
              <span>{movie.release_date}</span>
              <span>{movie.genres.map((genre) => genre.name).join(", ")}</span>
              <span>{runtimeText}</span>
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-[89%] grid-cols-1 gap-8 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,28%)] lg:gap-[30px]">
          <div className="flex items-start gap-5 sm:gap-8">
            {posterUrl ? (
              <img src={posterUrl} alt={`${movie.title} 포스터`} className="w-[120px] shrink-0 rounded-[10px] object-cover shadow-xl sm:h-[286px] sm:w-[200px]" />
            ) : (
              <div className="flex h-[180px] w-[120px] shrink-0 items-center justify-center rounded-[10px] bg-gray-200 text-sm text-[#6b7280] sm:h-[286px] sm:w-[200px]">
                포스터 없음
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h2 className="mb-3 text-lg font-bold tracking-[-1px] sm:text-[21px]">{movie.tagline}</h2>
              <p className="mb-4 whitespace-pre-line text-sm leading-6 text-[#6b7280]">{movie.overview}</p>
              <BookmarkButton movieId={movie.id} variant="detail" />
            </div>
          </div>
          <MovieReview key={movie.id} movieId={movie.id} />
        </section>
      </main>
    </>
  );
}
