import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

// CSS Module(movie-detail-page.module.css)에서 Tailwind 유틸리티 클래스로 전환
export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" }); //path param을 가져와 영화를 찾고 아래서 상세 정보 표시
  const movie = movies.find((item) => item.id === Number(movieId));

  // 목록의 BookmarkButton과 같은 zustand store를 구독 -> 한 화면에서 바꾸면 다른 화면에도 반영됨.
  // Hook이라 아래 early return(!movie)보다 먼저 호출해야 함.
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(Number(movieId)),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  if (!movie) {
    return (
      <main className="px-8 py-16 text-center text-gray-500">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return (
    <main>
      {/* 배경 이미지 위에 before:로 그라데이션을 깔아 하단 텍스트 대비를 확보  */}
      <div
        className="relative flex min-h-60 flex-col justify-end gap-8 bg-cover bg-center bg-[#111318] px-4 pt-5 pb-6 text-white sm:min-h-80 sm:px-8 before:absolute before:inset-0 before:bg-gradient-to-b before:from-black/15 before:to-black/80 before:content-['']"
        style={{ backgroundImage: `url(${movie.backdropPath})` }}
      >
        <Link
          to="/"
          className="relative z-10 inline-flex w-fit items-center gap-1.5 text-sm text-white no-underline"
        >
          <img
            src="/icons/chevron-left.svg"
            alt=""
            className="size-3.5 invert"
          />
          영화 목록
        </Link>

        <div className="relative z-10 mt-auto">
          <h1 className="mb-1 text-2xl font-bold text-white sm:text-[32px]">
            {movie.title}
          </h1>
          <p className="mb-2 text-[15px] text-white/80">
            {movie.originalTitle}
          </p>
          <p className="m-0 flex gap-3 text-sm text-white/85">
            <span>{movie.releaseDate}</span>
            <span>{movie.genres.join(" · ")}</span>
            <span>{movie.runtime}</span>
          </p>
        </div>
      </div>

      {/* 반응형: 모바일은 세로로 쌓고(포스터 → 설명 → 평점), lg(1024px~)부터 가로 3단 */}
      <div className="flex flex-col gap-6 p-4 sm:p-8 lg:flex-row lg:items-start lg:gap-8">
        <div className="shrink-0">
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="block aspect-[2/3] w-32 rounded-xl object-cover sm:w-40"
          />
        </div>

        <div className="min-w-0 flex-1 text-left">
          <h2 className="mb-3 text-xl font-bold text-gray-900">
            {movie.tagline}
          </h2>
          <p className="mb-5 text-[15px] leading-[1.6] text-gray-500">
            {movie.overview}
          </p>
          {/* 목록 북마크 배지와 색 통일: 북마크됨 = 파랑, 아님 = 반투명 검정. 글자/아이콘은 항상 흰색 */}
          <button
            type="button"
            aria-pressed={isBookmarked}
            onClick={() => toggleBookmark(movie.id)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-lg px-[18px] py-2.5 text-sm font-semibold text-white transition-colors",
              isBookmarked ? "bg-blue-600" : "bg-black/55",
            )}
          >
            <img
              src={
                isBookmarked
                  ? "/icons/bookmark.svg"
                  : "/icons/bookmark-outline.svg"
              }
              alt=""
              className="size-4 invert"
            />
            즐겨찾기
          </button>
        </div>

        <div className="w-full shrink-0 border-t border-gray-200 pt-6 text-left lg:w-[260px] lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
          <h2 className="mb-1 text-lg font-bold text-gray-900">내 평점</h2>
          <p className="mb-3 text-[13px] text-gray-500">
            별점은 필수, 후기는 선택이에요.
          </p>
          <div className="mb-4 flex gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <img
                key={n}
                src="/icons/star-outline.svg"
                alt={`${n}점`}
                className="size-[22px]"
              />
            ))}
          </div>
          <textarea
            className="mb-3 min-h-[90px] w-full resize-y rounded-lg border border-gray-200 px-3 py-2.5 text-gray-900"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
          />
          <button
            type="button"
            className="w-full cursor-pointer rounded-lg bg-gray-900 p-3 text-sm font-semibold text-white"
          >
            평점 저장
          </button>
        </div>
      </div>
    </main>
  );
}
