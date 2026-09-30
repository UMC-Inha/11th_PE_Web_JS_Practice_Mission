import { Link, useParams } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));
  if (!movie) return <main className="mx-auto w-full max-w-[1280px] flex-1 px-5 py-16">영화를 찾을 수 없어요.</main>;
  return <MovieDetailContent key={movie.id} movie={movie} />;
}

function MovieDetailContent({ movie }: { movie: Movie }) {
  const [bookmarked, setBookmarked] = useState(movie.isBookmarked);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");
  function saveReview(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(rating ? "평점을 저장했어요. 이 화면을 떠나면 초기화돼요." : "별점을 선택해 주세요.");
  }
  return (
    <main className="flex-1">
      <section className="relative h-[360px] overflow-hidden bg-[#252525] text-white">
        <img src={movie.backdropPath} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="relative mx-auto flex h-full w-[calc(100%-40px)] max-w-[1280px] flex-col py-7 md:w-[calc(100%-80px)] lg:w-[calc(100%-160px)]">
          <Link to="/" className="flex w-fit items-center gap-2 text-sm font-bold"><span aria-hidden="true">〈</span> 영화 목록</Link>
          <div className="mt-auto">
            <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-[44px]">{movie.title}</h1>
            <p className="mt-2 text-sm">{movie.originalTitle}</p>
            <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm font-semibold"><span>{movie.releaseDate}</span><span>{movie.genres.join(" · ")}</span><span>{movie.runtime}</span></p>
          </div>
        </div>
      </section>
      <section aria-label="영화 소개와 내 평점" className="mx-auto grid min-h-[342px] w-[calc(100%-40px)] max-w-[1280px] gap-8 py-6 md:w-[calc(100%-80px)] lg:w-[calc(100%-160px)] lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-8 sm:flex-row">
          <img src={movie.posterPath} alt={`${movie.title} 포스터`} className="h-[286px] w-[200px] shrink-0 rounded-lg object-cover shadow-xl" />
          <div className="min-w-0">
            <h2 className="text-xl font-bold">{movie.tagline}</h2>
            <p className="mt-4 text-sm leading-7 text-[#788191]">{movie.overview}</p>
            <button type="button" aria-pressed={bookmarked} onClick={() => setBookmarked(!bookmarked)} className="mt-4 flex items-center gap-2 rounded-md bg-[#2864fa] px-4 py-3 text-sm font-bold text-white">
              <img src={bookmarked ? "/movie-icons/bookmark.svg" : "/movie-icons/bookmark-outline.svg"} alt="" className="h-4 w-4 brightness-0 invert" />
              {bookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
            </button>
          </div>
        </div>
        <form onSubmit={saveReview} className="border-t border-[#e2e5eb] pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
          <h2 className="text-xl font-bold">내 평점</h2>
          <p className="mt-2 text-xs text-[#939baa]">별점은 필수, 후기는 선택이에요.</p>
          <div role="group" aria-label="별점 선택" className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" aria-label={`${value}점`} aria-pressed={rating === value} onClick={() => { setRating(value); setMessage(""); }} className={cn("flex h-10 w-10 items-center justify-center rounded-lg border border-[#dce1e8] bg-white text-2xl", value <= rating ? "text-[#2864fa]" : "text-[#687180]")}>★</button>)}
          </div>
          <textarea aria-label="영화 후기" value={review} onChange={(event) => setReview(event.target.value)} placeholder="영화를 보고 느낀 점을 남겨보세요." className="mt-2 h-[102px] w-full resize-none rounded-lg border border-[#dce1e8] bg-white p-3 text-sm placeholder:text-[#939baa]" />
          <button type="submit" className="mt-2 h-10 w-full rounded-md bg-[#181a20] text-sm font-bold text-white">평점 저장</button>
          <p role="status" className="mt-2 text-xs text-[#677080]">{message}</p>
        </form>
      </section>
    </main>
  );
}
