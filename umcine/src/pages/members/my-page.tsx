import { useState } from "react";
import { movies } from "../../data/movies";
import { Pagination } from "../../components/movies/pagination";
import { Link } from "@tanstack/react-router";

export function MyPage() {
  const member = {
    nickname: "윤샘",
    email: "name@example.com",
  };

  const [currentPage, setCurrentPage] = useState(1);

  const favoriteMovies = movies.filter((movie) => [1, 2, 5].includes(movie.id));

  return (
    <main className="flex-1 bg-[#f6f7f9] px-5 py-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex items-center justify-between border-b border-[#dfe3ea] pb-6">
          <h1 className="text-[32px] font-bold">내 정보</h1>

          <Link
            to="/my-edit"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#2563eb] px-4 text-sm font-bold text-white"
          >
            정보 수정
          </Link>
        </div>

        <section
          className="border-b border-[#dfe3ea] py-5"
          aria-labelledby="basic-info-heading"
        >
          <h2 id="basic-info-heading" className="mb-4 text-base font-bold">
            기본 정보
          </h2>

          <div className="flex items-center gap-6">
            <div className="grid size-20 shrink-0 place-items-center rounded-full bg-[#e5e7eb]">
              <img
                src="/icons/person.svg"
                alt="기본 프로필"
                className="scale-200"
              />
            </div>

            <dl className="grid flex-1 grid-cols-2 gap-6">
              <div>
                <dt className="mb-1 text-xs text-[#98a2b3]">닉네임</dt>
                <dd className="text-sm font-semibold">{member.nickname}</dd>
              </div>

              <div>
                <dt className="mb-1 text-xs text-[#98a2b3]">이메일</dt>
                <dd className="text-sm font-semibold">{member.email}</dd>
              </div>
            </dl>
          </div>
        </section>
        <section className="pt-6" aria-labelledby="favorite-movies-heading">
          <h2 id="favorite-movies-heading" className="mb-4 text-base font-bold">
            내 즐겨찾기
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {favoriteMovies.map((movie) => (
              <article key={movie.id} className="min-w-0">
                <img
                  src={movie.posterPath}
                  alt={`${movie.title} 포스터`}
                  className="h-68 w-full rounded-lg object-cover"
                />

                <h3 className="mt-2 truncate text-sm font-bold">
                  {movie.title}
                </h3>

                <p className="mt-1 text-xs text-[#98a2b3]">
                  {movie.releaseDate}
                </p>
              </article>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={1}
            onPageChange={setCurrentPage}
          />
        </section>
      </div>
    </main>
  );
}
