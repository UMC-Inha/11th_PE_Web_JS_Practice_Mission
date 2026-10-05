import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

const STARS = [1, 2, 3, 4, 5];

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="flex flex-1 items-center justify-center py-24 text-sm text-gray-500">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return (
    <main className="flex-1">
      <section className="relative h-90 overflow-hidden">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-360 flex-col justify-between px-20 py-8 text-white">
          <Link to="/" className="flex items-center gap-1 self-start text-xs font-semibold">
            <img src="/icons/chevron-left.svg" alt="" className="h-4 w-4 brightness-0 invert" />
            영화 목록
          </Link>

          <div>
            <h1 className="text-[44px] font-bold">{movie.title}</h1>
            <p className="mt-1 text-sm text-white/80">{movie.originalTitle}</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
              <span>{movie.releaseDate}</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>{movie.runtime}</span>
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-360 gap-10 px-20 py-10">
        <div className="flex flex-1 gap-8">
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="aspect-2/3 w-50 shrink-0 rounded-xl object-cover shadow-lg"
          />
          <div>
            <h2 className="text-lg font-bold">{movie.tagline}</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">{movie.overview}</p>
            <button className="mt-5 flex items-center gap-2 rounded-lg bg-[#4f5de8] px-4 py-2 text-sm font-semibold text-white">
              <img src="/icons/bookmark-outline.svg" alt="" className="h-4 w-4 brightness-0 invert" />
              즐겨찾기
            </button>
          </div>
        </div>

        <aside className="w-85 shrink-0 border-l border-gray-200 pl-10">
          <h2 className="text-base font-bold">내 평점</h2>
          <p className="mt-1 text-xs text-gray-400">별점은 필수, 후기는 선택이에요.</p>
          <div className="mt-3 flex gap-2">
            {STARS.map((star) => (
              <button
                key={star}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white"
              >
                <img src="/icons/star.svg" alt={`${star}점`} className="h-5 w-5 opacity-70" />
              </button>
            ))}
          </div>
          <textarea
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="mt-4 h-24 w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none placeholder:text-gray-400"
          />
          <button className="mt-3 w-full rounded-lg bg-[#111111] py-3 text-sm font-semibold text-white">
            평점 저장
          </button>
        </aside>
      </section>
    </main>
  );
}