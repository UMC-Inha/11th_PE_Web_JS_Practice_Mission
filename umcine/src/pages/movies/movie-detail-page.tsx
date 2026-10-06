import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";
import { readBookmarkIds, saveBookmarkIds } from "../../utils/bookmark-storage";

const pageX = "px-[max(80px,calc((100%_-_1280px)/2))]";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  // 훅은 early return보다 위에 있어야 해요.
  const [bookmarkedMovieIds, setBookmarkedMovieIds] = useState<number[]>(() =>
    readBookmarkIds(),
  );

  useEffect(() => {
    saveBookmarkIds(bookmarkedMovieIds);
  }, [bookmarkedMovieIds]);

  if (!movie) {
    return <main className={cn("py-6", pageX)}>영화를 찾을 수 없어요.</main>;
  }

  const isBookmarked = bookmarkedMovieIds.includes(movie.id);

  const toggleBookmark = () => {
    setBookmarkedMovieIds((prev) =>
      prev.includes(movie.id)
        ? prev.filter((id) => id !== movie.id)
        : [...prev, movie.id],
    );
  };

  return (
    <main className="min-h-[calc(100vh-148px)] bg-[#f5f6f8]">
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
            "relative flex h-full flex-col justify-between py-8 text-white",
            pageX,
          )}
        >
          <Link to="/" className="w-fit text-sm text-white/90 hover:text-white">
            ‹ 영화 목록
          </Link>
          <div>
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <p className="mt-1 text-sm text-white/80">{movie.originalTitle}</p>
            <p className="mt-2 flex gap-3 text-xs text-white/70">
              <span>{movie.releaseDate}</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>{movie.runtime}</span>
            </p>
          </div>
        </div>
      </section>

      <div className={cn("flex gap-8 py-6", pageX)}>
        <img
          className="aspect-5/7 w-50 shrink-0 self-start rounded-lg object-cover shadow-md"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold">{movie.tagline}</h2>
          <p className="mt-3 text-[13px] leading-relaxed text-gray-500">
            {movie.overview}
          </p>
          <button
            type="button"
            onClick={toggleBookmark}
            aria-pressed={isBookmarked}
            className={cn(
              "mt-4 inline-flex h-8 items-center gap-1.5 rounded-md border border-blue-600 px-3 text-xs font-semibold",
              isBookmarked ? "bg-white text-blue-600" : "bg-blue-600 text-white",
            )}
          >
            <img
              className={cn(!isBookmarked && "brightness-0 invert")}
              src="/icons/bookmark-outline.svg"
              alt=""
              width={12}
              height={12}
            />
            {isBookmarked ? "북마크 해제" : "북마크"}
          </button>
        </div>

        <aside className="w-[360px] shrink-0 border-l border-gray-200 pl-8">
          <h2 className="text-base font-bold">내 평점</h2>
          <p className="mt-1 text-xs text-gray-400">별점을 선택해 주세요.</p>
          <div className="mt-3 flex gap-1 text-2xl text-gray-300" aria-hidden="true">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
          </div>
          <textarea
            className="mt-3 h-24 w-full resize-none rounded-md border border-gray-200 bg-white p-3 text-xs"
            placeholder="영화를 보고 느낀 점을 남겨 보세요."
            aria-label="평점 후기"
          />
          <button
            type="button"
            className="mt-3 h-9 w-full rounded-md bg-gray-900 text-xs font-semibold text-white"
          >
            평점 저장
          </button>
        </aside>
      </div>
    </main>
  );
}