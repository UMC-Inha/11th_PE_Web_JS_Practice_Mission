import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";

export function SearchPage() {
    const { query } = useSearch({ from: "/search" });
    const navigate = useNavigate({ from: "/search"});
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

    return (
        <main
            className={cn(
                "min-h-[calc(100vh-56px)]",
                normalizedQuery
                    ? "mx-auto w-full max-w-[1280px] px-5 py-10"
                    : "flex flex-col items-center justify-center gap-8 px-5",
            )}
        >
            <h1
  className={cn(
    "m-0 font-bold text-[#171717]",
    normalizedQuery ? "mb-6 text-3xl" : "text-center text-4xl",
  )}
>
  {normalizedQuery ? "영화 검색" : "어떤 영화를 찾고 있나요?"}
</h1>
            <form
                onSubmit={handleSubmit}
                className={cn(
                    "flex items-center gap-3 rounded-lg border border-[#222] bg-white px-4 py-3 shadow-sm",
                    normalizedQuery ? "w-full" : "w-full max-w-[790px]",
                )}
            >
                <img src="/icons/search.svg" alt="" className="size-5" />
                <input
                    className="min-w-0 flex-1 border-0 bg-transparent outline-none"
                    aria-label="검색어"
                    placeholder="예: 스파이더맨"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                {normalizedQuery && (
  <button
    type="button"
    aria-label="검색어 지우기"
    className="grid size-6 place-items-center"
    onClick={() => {
      setSearchText("");
      navigate({ search: {} });
    }}
  >
    <img src="/icons/close.svg" alt="" className="size-4" />
  </button>
)}
<button
  type="submit"
  className="rounded bg-[#201e2d] px-4 py-2 text-sm text-white"
>
  {normalizedQuery ? "다시 검색" : "검색"}
</button>
            </form>

            {!normalizedQuery ? null : (
                <>
                    <div className="mt-6 flex items-center justify-between border-b border-[#e7e7e7] pb-4">
                        <h2 className="m-0 text-base font-semibold">'{query}' 검색 결과</h2>
                        <p className="m-0 text-sm text-[#8a8a8a]">
                            {searchResults.length}편
                        </p>
                    </div>
                    {searchResults.length === 0 ? (
                        <p>검색 결과가 없어요.</p>
                    ) : (
                        <ul className="mt-6 grid list-none grid-cols-2 gap-x-8 p-0">
                            {searchResults.map((movie) => (
                                <li
                                    key={movie.id}
                                    className="flex min-w-0 gap-4 border-b border-[#e7e7e7] py-5"
                                >
                                    <img
                                        className="aspect-[2/3] w-28 shrink-0 rounded object-cover"
                                        src={movie.posterPath}
                                        alt={`${movie.title} 포스터`}
                                    />
                                <div className="min-w-0">
                                    <h3 className="m-0 text-base font-bold">{movie.title}</h3>
                                    <p className="mt-1 text-xs text-[#8a8a8a]">
                                        {movie.originalTitle} · {movie.releaseDate}
                                    </p>
                                    <p className="mt-3 text-sm text-[#6d6d6d]">{movie.overview}</p>
                                    <Link
                                        className="mt-4 inline-block text-sm font-semibold text-blue-600"
                                        to="/movies/$movieId"
                                        params={{ movieId: String(movie.id) }}
                                    >
                                        상세 보기 →
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                    )}
                </>
            )}
        </main>
    );  
}