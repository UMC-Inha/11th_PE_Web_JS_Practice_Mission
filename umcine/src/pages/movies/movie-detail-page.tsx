import { Link, useParams } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { BookmarkButton } from "../../components/bookmark-button";
import { movies } from "../../data/movies";

interface Review {
  rating: number;
  comment: string;
}

function readReview(movieId: number): Review {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(`umcine-review-${movieId}`) ?? "null");
    if (stored && typeof stored === "object" && "rating" in stored && "comment" in stored
      && typeof stored.rating === "number" && Number.isInteger(stored.rating)
      && stored.rating >= 1 && stored.rating <= 5 && typeof stored.comment === "string") {
      return { rating: stored.rating, comment: stored.comment };
    }
  } catch {
    // 저장된 평점이 잘못된 경우 빈 입력으로 시작해요.
  }
  return { rating: 0, comment: "" };
}

function MovieReview({ movieId }: { movieId: number }) {
  const [review, setReview] = useState(() => readReview(movieId));
  const [message, setMessage] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (review.rating === 0) {
      setMessage("별점을 선택해 주세요.");
      return;
    }
    try {
      localStorage.setItem(`umcine-review-${movieId}`, JSON.stringify(review));
      setMessage("평점을 저장했어요.");
    } catch {
      setMessage("평점을 저장하지 못했어요. 다시 시도해 주세요.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-[#e2e5eb] pt-6 lg:border-l lg:border-t-0 lg:pl-[30px] lg:pt-0">
      <h2 className="text-[21px] font-bold tracking-[-1px]">내 평점</h2>
      <p className="mb-2 mt-2 text-xs text-[#969DA8]">별점은 필수, 후기는 선택이에요.</p>
      <div role="group" aria-label="별점 선택" className="mb-2 flex gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            aria-label={`${rating}점`}
            aria-pressed={review.rating === rating}
            onClick={() => {
              setReview((current) => ({ ...current, rating }));
              setMessage("");
            }}
            className="grid h-[38px] w-[38px] place-items-center rounded-[8px] border border-[#e2e5eb] bg-white"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className={`h-6 w-6 ${rating <= review.rating ? "text-blue-600" : "text-[#6b7280]"}`} fill="currentColor">
              <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
            </svg>
          </button>
        ))}
      </div>
      <textarea
        aria-label="영화 후기"
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        value={review.comment}
        onChange={(event) => {
          setReview((current) => ({ ...current, comment: event.target.value }));
          setMessage("");
        }}
        className="block h-[102px] w-full resize-none rounded-[8px] border border-[#e2e5eb] bg-white p-3 text-sm leading-6 outline-none placeholder:text-[#969DA8] focus:border-blue-600"
      />
      <button type="submit" className="mt-2 h-10 w-full rounded-[8px] bg-[#17191e] text-sm font-bold text-white">평점 저장</button>
      <p role="status" className="mt-2 min-h-5 text-xs text-[#606774]">{message}</p>
    </form>
  );
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return <main className="px-[5.5%] py-10">영화를 찾을 수 없어요.</main>;
  }

  return (
    <>
      <main className="bg-[#f6f7f9]">
        <section className="relative h-[360px] overflow-hidden">
          <img src={movie.backdropPath} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <Link to="/" className="absolute left-[5.5%] top-6 z-10 flex items-center gap-2 text-[13px] font-bold text-white">
            <img src="/icons/chevron-left.svg" alt="" className="h-5 w-5 brightness-0 invert" />
            영화 목록
          </Link>
          <div className="absolute bottom-6 left-[5.5%] right-[5.5%] z-10 text-white">
            <h1 className="text-[32px] font-bold leading-tight tracking-[-2.3px] sm:text-[46px]">{movie.title}</h1>
            <p className="mb-2 mt-3 text-sm">{movie.originalTitle}</p>
            <div className="flex flex-wrap gap-2 text-[13px] font-bold">
              <span>{movie.releaseDate}</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>{movie.runtime}</span>
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-[89%] grid-cols-1 gap-8 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,28%)] lg:gap-[30px]">
          <div className="flex items-start gap-5 sm:gap-8">
            <img src={movie.posterPath} alt={`${movie.title} 포스터`} className="w-[120px] shrink-0 rounded-[10px] object-cover shadow-xl sm:h-[286px] sm:w-[200px]" />
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
