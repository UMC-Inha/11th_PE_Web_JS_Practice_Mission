import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbPosterUrl, getTmdbBackdropUrl } from "../../utils/movies/tmdb-image";
import { MovieImage } from "../../components/movies/movie-image";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { cn } from "../../utils/cn";
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
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadMovie() {
      try {
        const response = await getMovieDetail(movieId);
        if (!ignore) setMovie(response);
      } catch (error) {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    void loadMovie();
    return () => { ignore = true; };
  }, [movieId]);

  if (isLoading) return <main role="status" className="flex-1 px-5 py-16">영화 정보를 불러오는 중이에요.</main>;
  if (errorMessage) return <main role="alert" className="flex-1 px-5 py-16">{errorMessage}</main>;
  if (!movie) return <main className="flex-1 px-5 py-16">영화를 찾을 수 없어요.</main>;
  return <MovieDetailContent movie={movie} />;
}

function MovieDetailContent({ movie }: { movie: TmdbMovieDetail }) {

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");
  function saveReview(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(rating ? "평점을 저장했어요. 이 화면을 떠나면 초기화돼요." : "별점을 선택해 주세요.");
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
            <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm font-semibold"><span>{movie.release_date}</span><span>{movie.genres.map((genre) => genre.name).join(", ")}</span><span>{typeof movie.runtime === "number" ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분` : "상영 시간 정보가 없어요."}</span></p>
          </div>
        </div>
      </section>
      <section aria-label="영화 소개와 내 평점" className="mx-auto grid min-h-85.5 w-[calc(100%-40px)] max-w-320 gap-8 py-6 md:w-[calc(100%-80px)] lg:w-[calc(100%-160px)] lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-8 sm:flex-row">
          <MovieImage src={getTmdbPosterUrl(movie.poster_path)} alt={`${movie.title} 포스터`} className="h-71.5 w-50 shrink-0 rounded-lg object-cover shadow-xl" />
          <div className="min-w-0">
            <h2 className="text-xl font-bold">{movie.tagline}</h2>
            <p className="mt-4 text-sm leading-7 text-[#788191]">{movie.overview}</p>
            <BookmarkButton movieId={movie.id} className="mt-4" />
          </div>
        </div>
        <form onSubmit={saveReview} className="border-t border-[#e2e5eb] pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
          <h2 className="text-xl font-bold">내 평점</h2>
          <p className="mt-2 text-xs text-[#939baa]">별점은 필수, 후기는 선택이에요.</p>
          <div role="group" aria-label="별점 선택" className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" aria-label={`${value}점`} aria-pressed={rating === value} onClick={() => { setRating(value); setMessage(""); }} className={cn("flex h-10 w-10 items-center justify-center rounded-lg border border-[#dce1e8] bg-white text-2xl", value <= rating ? "text-[#2864fa]" : "text-[#687180]")}>★</button>)}
          </div>
          <textarea aria-label="영화 후기" value={review} onChange={(event) => setReview(event.target.value)} placeholder="영화를 보고 느낀 점을 남겨보세요." className="mt-2 h-25.5 w-full resize-none rounded-lg border border-[#dce1e8] bg-white p-3 text-sm placeholder:text-[#939baa]" />
          <button type="submit" className="mt-2 h-10 w-full rounded-md bg-[#181a20] text-sm font-bold text-white">평점 저장</button>
          <p role="status" className="mt-2 text-xs text-[#677080]">{message}</p>
        </form>
      </section>
    </main>
  );
}