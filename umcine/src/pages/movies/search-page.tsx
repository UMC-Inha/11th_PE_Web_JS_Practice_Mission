import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useState, type SubmitEvent } from 'react'
import { movies } from '../../data/movies'

export function SearchPage() {
  const { query } = useSearch({ from: '/search' })
  const navigate = useNavigate({ from: '/search' })
  const [searchText, setSearchText] = useState(query ?? '')

  const normalizedQuery = query?.trim().toLowerCase() ?? ''
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : []

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextQuery = searchText.trim()
    navigate({ search: nextQuery ? { query: nextQuery } : {} })
  }

  const searchForm = (fullWidth = false) => (
    <form
      className={`flex items-center gap-3 rounded-lg border border-[#cbd1d9] bg-white px-4 shadow-sm focus-within:border-[#2563eb] focus-within:ring-4 focus-within:ring-blue-100 ${fullWidth ? 'w-full' : 'w-full max-w-[340px]'}`}
      onSubmit={handleSubmit}
    >
      <img className="h-4 w-4" src="/icons/search.svg" alt="" />
      <input
        className="h-10 min-w-0 flex-1 border-0 bg-transparent text-sm outline-none"
        aria-label="검색어"
        placeholder="예: 스파이더맨"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
      />
      <button
        className="rounded bg-[#17191e] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#30333a]"
        type="submit"
      >
        검색
      </button>
    </form>
  )

  if (!normalizedQuery) {
    return (
      <main className="flex min-h-[calc(100vh-128px)] items-center justify-center px-5 pb-20 sm:px-10">
        <section className="flex w-full max-w-[340px] flex-col items-center">
          <h1 className="mb-5 text-center text-2xl font-bold tracking-tight text-[#17191e]">
            어떤 영화를 찾고 있나요?
          </h1>
          {searchForm()}
        </section>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-[1100px] px-5 pb-20 pt-8 sm:px-10">
      <h1 className="mb-5 text-[28px] font-bold tracking-tight text-[#17191e]">
        영화 검색
      </h1>
      {searchForm(true)}

      <section className="mt-7">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-[#17191e]">‘{query}’ 검색 결과</h2>
          <p className="mt-1 text-xs text-[#969da8]">영화 {searchResults.length}편</p>
        </div>

        {searchResults.length === 0 ? (
          <p className="py-16 text-center text-sm text-[#606774]">검색 결과가 없어요.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
            {searchResults.map((movie) => (
              <li className="flex gap-4 border-t border-[#e3e6eb] py-4" key={movie.id}>
                <img
                  className="h-28 w-[76px] shrink-0 rounded-md object-cover"
                  src={movie.posterPath}
                  alt={`${movie.title} 포스터`}
                />
                <div className="min-w-0 pt-1">
                  <h3 className="text-sm font-bold text-[#17191e]">{movie.title}</h3>
                  <p className="mt-1 text-xs text-[#606774]">{movie.originalTitle}</p>
                  <p className="mt-1 text-xs text-[#969da8]">{movie.releaseDate}</p>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#606774]">{movie.overview}</p>
                  <Link
                    className="mt-2 inline-block text-xs font-semibold text-[#2563eb] hover:underline"
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
      </section>
    </main>
  )
}
