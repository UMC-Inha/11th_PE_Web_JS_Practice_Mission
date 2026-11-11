import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { BookmarkButton } from "../../components/bookmark-button";
import RatingPanel from "../../components/movies/rating-panel";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({
    from: "/movies/$movieId",
  });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000,
  });

  if (!isValidMovieId) {
    return (
      <main className="w-full flex-1 px-5 py-12 xl:px-20">
        <h1 role="alert" className="text-2xl font-bold">
          올바르지 않은 영화 번호예요.
        </h1>
        <Link to="/" className="mt-5 inline-block text-blue-600 underline">
          영화 목록으로
        </Link>
      </main>
    );
  }

  if (movieDetailQuery.isPending) {
    return (
      <main className="w-full flex-1 px-5 py-12 xl:px-20">
        <p role="status" className="text-sm text-gray-500">
          영화 정보를 불러오는 중이에요.
        </p>
      </main>
    );
  }

  if (movieDetailQuery.isError) {
    return (
      <main className="w-full flex-1 px-5 py-12 xl:px-20">
        <h1 role="alert" className="text-2xl font-bold">
          {getMovieDetailErrorMessage(movieDetailQuery.error)}
        </h1>
        <Link to="/" className="mt-5 inline-block text-blue-600 underline">
          영화 목록으로
        </Link>
      </main>
    );
  }

  const movie = movieDetailQuery.data;
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const runtime = movie.runtime;
  const runtimeText =
    typeof runtime !== "number"
      ? "상영 시간 정보가 없어요."
      : runtime < 60
        ? `${runtime}분`
        : `${Math.floor(runtime / 60)}시간 ${runtime % 60}분`;

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