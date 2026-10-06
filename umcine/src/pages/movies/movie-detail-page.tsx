import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

// CSS Module(movie-detail-page.module.css)에서 Tailwind 유틸리티 클래스로 전환
export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" }); //path param을 가져와 영화를 찾고 아래서 상세 정보 표시
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="px-8 py-16 text-center text-gray-500">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return (
    <main>
      {/* 배경 이미지 위에 before:로 그라데이션을 깔아 하단 텍스트 대비를 확보 (기존 .hero::before 대체) */}
      <div
        className="relative flex min-h-80 flex-col justify-end gap-8 bg-cover bg-center bg-[#111318] px-8 pt-5 pb-6 text-white before:absolute before:inset-0 before:bg-gradient-to-b before:from-black/15 before:to-black/80 before:content-['']"
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
          <h1 className="mb-1 text-[32px] font-bold text-white">
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

      <div className="flex items-start gap-8 p-8">
        <div className="shrink-0">
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="block aspect-[2/3] w-40 rounded-xl object-cover"
          />
        </div>

        <div className="min-w-0 flex-1 text-left">
          <h2 className="mb-3 text-xl font-bold text-gray-900">
            {movie.tagline}
          </h2>
          <p className="mb-5 text-[15px] leading-[1.6] text-gray-500">
            {movie.overview}
          </p>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-[18px] py-2.5 text-sm font-semibold text-white"
          >
            <img
              src="/icons/bookmark-outline.svg"
              alt=""
              className="size-4 invert"
            />
            즐겨찾기
          </button>
        </div>

        <div className="w-[260px] shrink-0 border-l border-gray-200 pl-8 text-left">
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
