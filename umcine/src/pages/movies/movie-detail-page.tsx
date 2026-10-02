import {
  Link,
  useParams,
} from "@tanstack/react-router";

import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({
    from: "/movies/$movieId",
  });

  const movie = movies.find(
    (item) =>
      item.id === Number(movieId),
  );

  if (!movie) {
    return (
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-12 lg:px-20">
        <h1 className="text-2xl font-bold">
          영화를 찾을 수 없어요.
        </h1>

        <Link
          to="/"
          className="mt-5 inline-block text-blue-600 underline"
        >
          영화 목록으로
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="relative h-[300px] overflow-hidden sm:h-[400px]">
        <img
          className="h-full w-full object-cover"
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
        />

        <div className="absolute inset-0 bg-black/40" />
      </div>

      <section className="mx-auto w-full max-w-[1440px] px-5 py-10 lg:px-20">
        <Link
          to="/"
          className="text-sm underline"
        >
          ← 영화 목록
        </Link>

        <div className="mt-7 flex flex-col gap-8 sm:flex-row">
          <img
            className="w-[220px] rounded-xl object-cover"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />

          <div>
            <h1 className="text-3xl font-bold">
              {movie.title}
            </h1>

            <p className="mt-2 text-gray-500">
              {movie.originalTitle}
            </p>

            <p className="mt-6">
              개봉일: {movie.releaseDate}
            </p>

            <p className="mt-2">
              장르:{" "}
              {movie.genres.join(" · ")}
            </p>

            <p className="mt-2">
              상영 시간: {movie.runtime}
            </p>

            <h2 className="mt-7 text-xl font-bold">
              {movie.tagline}
            </h2>

            <p className="mt-4 max-w-2xl leading-7">
              {movie.overview}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}