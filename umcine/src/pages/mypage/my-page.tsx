import { useState } from "react";
import { Footer } from "../../components/layout/footer";
import Pagination from "../../components/movies/pagination";

const favoriteMovies = [
  {
    id: 1,
    title: "스파이더맨: 브랜드 뉴 데이",
    releaseDate: "2026.07.29",
    poster: "/images/movies/spider-man-brand-new-day.jpg",
  },
  {
    id: 2,
    title: "오디세이",
    releaseDate: "2026.08.05",
    poster: "/images/movies/odyssey.jpg",
  },
  {
    id: 3,
    title: "미니언즈 & 몬스터즈",
    releaseDate: "2026.07.15",
    poster: "/images/movies/minions-monsters.jpg",
  },
];

export function MyPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const nickname = "gs0428";
  const email = "gwangsoo@cinemalab.kr";

  return (
    <div className="flex min-h-[calc(100vh-91px)] flex-col bg-[#f6f7f9]">
      <main className="flex-1 px-5 py-6 md:px-20">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#17191E]">
            내 정보
          </h1>

          <button
            type="button"
            className="h-10 rounded-lg bg-[#2563EB] px-4 text-sm font-extrabold text-white"
          >
            정보 수정
          </button>
        </div>

        <section className="mt-7 flex flex-col gap-4 border-y border-[#E3E6EB] py-3">
          <h2 className="text-base font-bold text-[#17191E]">
            기본 정보
          </h2>

          <div className="flex flex-wrap items-center gap-7">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#E3E6EB]">
              <img
                src="/icons/person.svg"
                alt=""
                className="h-12 w-12"
              />
            </div>

            <div className="flex w-full max-w-[760px] flex-1 gap-7">
              <div className="flex flex-1 flex-col gap-1.5">
                <span className="text-xs text-[#969DA8]">
                  닉네임
                </span>
                <span className="text-sm font-bold text-[#17191E]">
                  {nickname}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-1.5">
                <span className="text-xs text-[#969DA8]">
                  이메일
                </span>
                <span className="break-all text-sm font-bold text-[#17191E]">
                  {email}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-7 flex flex-col gap-4">
          <h2 className="text-base font-bold text-[#17191E]">
            내 즐겨찾기
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {favoriteMovies.map((movie) => (
              <div key={movie.id} className="flex flex-col gap-1">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="h-72 w-full rounded-[10px] object-cover"
                />

                <p className="pt-[5px] text-sm font-extrabold text-[#17191E]">
                  {movie.title}
                </p>

                <p className="text-xs text-[#969DA8]">
                  {movie.releaseDate}
                </p>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={1}
            onPageChange={setCurrentPage}
          />
        </section>
      </main>
      <Footer />
    </div >
  );
}