import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbPosterUrl, getTmdbBackdropUrl } from "../../utils/movies/tmdb-image";
import { MovieImage } from "../../components/movies/movie-image";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { MovieRatingForm } from "../../components/movies/movie-rating-form";
import { BookmarkButton } from "../../components/bookmark-button";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
    return <main className="mx-auto w-full max-w-320 flex-1 px-5 py-16">올바르지 않은 영화 번호예요.</main>;
  }
  return <MovieDetailRequest key={parsedMovieId} movieId={parsedMovieId} />;
}

function MovieDetailRequest({ movieId }: { movieId: number }) {
  const movieQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    staleTime: 30 * 1000,
    enabled: Number.isInteger(movieId) && movieId > 0,
  });

  if (movieQuery.isPending) return <main role="status" className="flex-1 px-5 py-16">영화 정보를 불러오는 중이에요.</main>;
  if (movieQuery.isError) return <main role="alert" className="flex-1 px-5 py-16">{getMovieDetailErrorMessage(movieQuery.error)}</main>;
  if (!movieQuery.data) return <main className="flex-1 px-5 py-16">영화를 찾을 수 없어요.</main>;
  return <MovieDetailContent movie={movieQuery.data} />;
}

function MovieDetailContent({ movie }: { movie: TmdbMovieDetail }) {

  const genresText = movie.genres.map((genre) => genre.name).join(", ");
  let runtimeText = "상영 시간 정보가 없어요.";

  if (typeof movie.runtime === "number") {
    const hours = Math.floor(movie.runtime / 60);
    const minutes = movie.runtime % 60;
    runtimeText = hours > 0
      ? `${hours}시간 ${minutes}분`
      : `${minutes}분`;
  }

  return (
    <main className="flex-1">
      <section className="relative h-90 overflow-hidden bg-[#252525] text-white">
        <MovieImage src={getTmdbBackdropUrl(movie.backdrop_path)} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="relative mx-auto flex h-full w-[calc(100%-40px)] max-w-320 flex-col py-7 md:w-[calc(100%-80px)] lg:w-[calc(100%-160px)]">
          <Link to="/" className="flex w-fit items-center gap-2 text-sm font-bold"><span aria-hidden="true">〈</span> 영화 목록</Link>
          <div className="mt-auto">
            <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-[44px]">{movie.title}</h1>
            <p className="mt-2 text-sm">{movie.original_title}</p>
            <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm font-semibold">
              <span>{movie.release_date}</span>
              <span>{genresText}</span>
              <span>{runtimeText}</span>
            </p>
          </div>
        </div>
      </section>
      <section aria-label="영화 소개와 내 평점" className="mx-auto grid min-h-85.5 w-[calc(100%-40px)] max-w-320 gap-8 py-6 md:w-[calc(100%-80px)] lg:w-[calc(100%-160px)] lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-8 sm:flex-row">
          <MovieImage src={getTmdbPosterUrl(movie.poster_path)} alt={`${movie.title} 포스터`} className="h-71.5 w-50 shrink-0 rounded-lg object-cover shadow-xl" />
          <div className="min-w-0">
            <h2 className="text-xl font-bold">{movie.tagline}</h2>
            <p className="mt-4 text-sm leading-7 text-[#788191]">{movie.overview}</p>
            <BookmarkButton movieId={movie.id} checkStatus className="mt-4" />
          </div>
        </div>
        <MovieRatingForm movieId={movie.id} />
      </section>
    </main>
  );
}
