import { Link, useParams } from "@tanstack/react-router"
import { movies } from "../../data/movies";

export function MovieDetailPage() {
    const { movieId } = useParams({ from: "/movies/$movieId" });
    const movie = movies.find((item) => item.id === Number(movieId));

if (!movie) {
  return <main>영화를 찾을 수 없어요.</main>;
}

    return (
        <main className="flex flex-1 flex-col">
   <section className="relative h-90 overflow-hidden">
  <img
    src={movie.backdropPath}
    alt=""
    aria-hidden="true"
    className="absolute inset-0 h-full w-full object-cover"
  />
  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

  <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col px-5 py-7 text-white">
    <Link to="/" className="text-sm">
      〈 영화 목록
    </Link>
    <div className="mt-auto">
      <h1 className="text-4xl font-bold">{movie.title}</h1>
      <p className="mt-2 text-sm">{movie.originalTitle}</p>
      <p className="mt-2 text-sm">
        {movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime}
      </p>
    </div>
  </div>
</section>
            <section className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-[240px_minmax(0,1fr)_320px] gap-8 px-5 py-12">
  <img
    src={movie.posterPath}
    alt={`${movie.title} 포스터`}
    className="h-90 w-60 shrink-0 rounded-xl object-cover"
  />

  <div className="min-w-0">
    <h2 className="text-2xl font-bold">{movie.tagline}</h2>
    <p className="mt-6 leading-7">{movie.overview}</p>
    <div className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white">
      <img src="/icons/bookmark-outline.svg" alt="" className="size-5 invert" />
      즐겨찾기
    </div>
  </div>
  <aside>
    <h2 className="m-0 text-lg font-bold">내 평점</h2>
    <p className="mt-2 text-xs text-gray-500">
      별점을 선택하고, 후기도 남겨보세요.
    </p>
    <div className="mt-3 flex gap-2" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className="grid size-9 place-items-center rounded bg-[#ededf0]">
          <img src="/icons/star.svg" alt="" className="size-5 opacity-60" />
        </span>
      ))}
    </div>
    <div className="mt-3 h-25 rounded-md border border-[#e6e6e8] bg-white p-3 text-xs text-[#aaa]">
      영화를 보고 느낀 점을 남겨보세요.
    </div>
    <div className="mt-2 grid h-10 place-items-center rounded-md bg-[#1b1b22] text-sm font-semibold text-white">
      평점 저장
    </div>
  </aside>
</section>
        </main>
    );
}
