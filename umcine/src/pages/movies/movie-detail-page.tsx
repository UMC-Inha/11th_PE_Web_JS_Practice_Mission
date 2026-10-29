import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

const pageX = "px-[max(80px,calc((100%_-_1280px)/2))]";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  // 훅은 early return보다 위에 있어야 해요.
  const isBookmarked = useBookmarkStore((state) =>
    movie ? state.bookmarkedMovieIds.includes(movie.id) : false,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  if (!movie) {
    return <main className={cn("py-6", pageX)}>영화를 찾을 수 없어요.</main>;
  }

  return (
    <main className="min-h-[calc(100vh-148px)] bg-[#f5f6f8]">
      {/* 히어로: 높이 360, 위아래 패딩 24 */}
      <section className="relative h-90 overflow-hidden">
        <img
          className="absolute inset-0 size-full object-cover"
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-black/10" />
        <div
          className={cn(
            "relative flex h-full flex-col justify-between py-6 text-white",
            pageX,
          )}
        >
          <Link
            to="/"
            className="inline-flex h-6 w-fit items-center gap-1 text-sm text-white/90 hover:text-white"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 3L5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            영화 목록
          </Link>

          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <p className="text-sm text-white/80">{movie.originalTitle}</p>
            <p className="flex gap-3 text-xs text-white/70">
              <span>{movie.releaseDate}</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>{movie.runtime}</span>
            </p>
          </div>
        </div>
      </section>

      {/* 본문: 포스터 200 / 줄거리 fill / 평점 패널 360, 간격 32, 패딩 80·24 */}
      <div className={cn("flex items-start gap-8 py-6", pageX)}>
        <img
          className="h-[286px] w-[200px] shrink-0 rounded-lg object-cover shadow-md"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />

        <section className="flex min-w-0 flex-1 flex-col items-start gap-3">
          <h2 className="text-base font-bold">{movie.tagline}</h2>
          <p className="text-[13px] leading-relaxed text-gray-500">
            {movie.overview}
          </p>
          <button
            type="button"
            onClick={() => toggleBookmark(movie.id)}
            aria-pressed={isBookmarked}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-md border border-blue-600 px-3 text-xs font-semibold",
              isBookmarked
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600",
            )}
          >
            <img
              className={cn(isBookmarked && "brightness-0 invert")}
              src="/icons/bookmark-outline.svg"
              alt=""
              width={12}
              height={12}
            />
            {isBookmarked ? "북마크 해제" : "북마크"}
          </button>
        </section>

        {/* 평점 패널: 폭 360, 왼쪽 선 1 + 패딩 30 → 내용 폭 329, 요소 간격 8 */}
        <aside className="flex w-[360px] shrink-0 flex-col gap-2 border-l border-gray-200 pb-[41px] pl-[30px]">
          <h2 className="text-base font-bold">내 평점</h2>
          <p className="text-[11px] leading-3.5 text-gray-400">
            별점은 필수, 후기는 선택이에요.
          </p>
          <div className="flex h-[38px] items-center gap-1" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className="flex size-[38px] items-center justify-center rounded-lg border border-gray-200 bg-white"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#4b5563">
                  <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2z" />
                </svg>
              </span>
            ))}
          </div>
          <textarea
            className="h-[102px] w-full resize-none rounded-md border border-gray-200 bg-white px-3 pt-4 pb-[18px] text-xs"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            aria-label="평점 후기"
          />
          <button
            type="button"
            className="h-[42px] w-full rounded-md bg-gray-900 px-4 text-xs font-semibold text-white"
          >
            평점 저장
          </button>
        </aside>
      </div>
    </main>
  );
}