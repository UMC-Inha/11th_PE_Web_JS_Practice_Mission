import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import { Footer } from "../../components/layout/footer";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

    if (!normalizedQuery) {
        return (
        <div className="min-h-[calc(100vh-91px)] bg-[#f6f7f9]">
            <main className="flex min-h-[582px] w-full items-center justify-center">
            <div className="flex w-[790px] flex-col items-center gap-9">
                <h1 className="text-[38px] font-bold tracking-[-1.71px] text-[#17191e]">
                어떤 영화를 찾고 있나요?
                </h1>

                <form
                onSubmit={handleSubmit}
                className="flex h-[74px] w-full items-center rounded-[10px] border border-[#e3e6eb] bg-white px-[18px]"
                >
                <img
                    src="/icons/search.svg"
                    alt=""
                    className="h-6 w-6"
                />

                <input
                    aria-label="영화 제목"
                    placeholder="예: 스파이더맨"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    className="ml-[14px] min-w-0 flex-1 text-[16px] outline-none placeholder:text-[#969da8]"
                />

                <button
                    type="submit"
                    className="ml-[14px] h-[42px] rounded-lg bg-[#17191e] px-[17px] text-sm font-bold text-white"
                >
                    검색
                </button>
                </form>
            </div>
            </main>
        </div>
        );
    }

    return (
    <div className="flex min-h-[calc(100vh-91px)] flex-col bg-[#f6f7f9]">
        <main className="w-full flex-1 px-20 py-6">
            <div className="flex w-full flex-col gap-[17px]">
            <h1 className="text-[38px] font-bold leading-[44px] tracking-[-1.71px] text-[#17191e]">
                영화 검색
            </h1>

            <form
                onSubmit={handleSubmit}
                className="flex h-[54px] w-full items-center rounded-[10px] border border-[#e3e6eb] bg-white px-4"
            >
                <img
                src="/icons/search.svg"
                alt=""
                className="h-6 w-6"
                />

                <input
                aria-label="검색어"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                className="ml-[18px] min-w-0 flex-1 text-sm outline-none"
                />

                <button
                    type="button"
                    aria-label="검색어 지우기"
                    onClick={() => setSearchText("")}
                    className="ml-[18px] flex h-6 w-6 shrink-0 items-center justify-center"
                >
                    <img
                        src="/icons/close.svg"
                        alt=""
                        className="h-6 w-6"
                    />
                </button>

                <button
                type="submit"
                className="ml-[18px] h-[42px] rounded-lg bg-[#17191e] px-[17px] text-sm font-bold text-white"
                >
                다시 검색
                </button>
            </form>
            </div>

            <div className="flex h-[54px] items-center justify-between">
            <h2 className="text-[18px] font-bold text-[#17191e]">
                ‘{query}’ 검색 결과
            </h2>

            <p className="text-xs text-[#606774]">
                영화 {searchResults.length}편 · 1페이지
            </p>
            </div>

            {searchResults.length === 0 ? (
                <p className="py-10 text-center text-sm text-[#606774]">
                    검색 결과가 없어요.
                </p>
            ) : (
                <ul className="grid grid-cols-2 gap-x-10">
                    {searchResults.map((movie) => (
                        <li
                            key={movie.id}
                            className="flex h-[240px] gap-[18px] py-5"
                        >
                            <img
                                src={movie.posterPath}
                                alt={`${movie.title} 포스터`}
                                className="h-[190px] w-[126px] shrink-0 rounded-lg object-cover"
                            />

                            <div className="flex min-w-0 flex-1 flex-col gap-2">
                                <h3 className="text-[18px] font-bold text-[#17191e]">
                                    {movie.title}
                                </h3>

                                <div className="flex items-center gap-2 text-xs text-[#969da8]">
                                    <span>{movie.originalTitle}</span>
                                    <span>{movie.releaseDate}</span>
                                </div>

                                <p className="h-[66px] overflow-hidden pt-[3px] text-[12.5px] leading-[20.25px] text-[#606774]">
                                    {movie.overview}
                                </p>

                                <Link
                                    to="/movies/$movieId"
                                    params={{ movieId: String(movie.id) }}
                                    className="flex w-fit items-center gap-1 text-xs font-extrabold text-[#2563eb]"
                                >
                                    <span>상세 보기</span>
                                    <img
                                        src="/icons/arrow-right.svg"
                                        alt=""
                                        className="h-4 w-4 [filter:invert(35%)_sepia(95%)_saturate(3000%)_hue-rotate(215deg)_brightness(95%)_contrast(95%)]"
                                    />
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </main>

        <Footer/>
    </div>
    );
}