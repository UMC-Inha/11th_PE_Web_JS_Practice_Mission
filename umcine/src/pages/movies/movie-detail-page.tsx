import { Link, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getMovieDetail } from '../../api/movies/get-movie-details'
import type { TmdbMovieDetail } from '../../api/movies/models'
import { BookmarkButton } from '../../components/bookmark-button'
import { getMovieDetailErrorMessage } from '../../utils/movies/get-movie-detail-error-message'
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from '../../utils/movies/tmdb-image'

function formatRuntime(runtime: number | null) {
  if (runtime === null) {
    return '상영 시간 정보가 없어요.'
  }

  const hours = Math.floor(runtime / 60)
  const minutes = runtime % 60

  return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: '/movies/$movieId' })
  const parsedMovieId = Number(movieId)
  const isValidMovieId =
    Number.isInteger(parsedMovieId) && parsedMovieId > 0

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    if (!isValidMovieId) {
      setMovie(null)
      setIsLoading(false)
      return () => {
        ignore = true
      }
    }

    async function loadMovie() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const response = await getMovieDetail(parsedMovieId)

        if (!ignore) {
          setMovie(response)
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(getMovieDetailErrorMessage(error))
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    loadMovie()

    return () => {
      ignore = true
    }
  }, [isValidMovieId, parsedMovieId])

  if (!isValidMovieId) {
    return (
      <main className="mx-auto max-w-[1100px] px-5 py-20 text-center sm:px-10">
        <h1 className="text-2xl font-bold text-[#17191e]">
          올바르지 않은 영화 번호예요.
        </h1>
        <Link
          className="mt-5 inline-block text-sm font-semibold text-[#2563eb]"
          to="/"
        >
          영화 목록으로 돌아가기
        </Link>
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-[1100px] px-5 py-20 text-center sm:px-10">
        <p className="text-sm text-[#606774]">
          영화 정보를 불러오는 중이에요.
        </p>
      </main>
    )
  }

  if (errorMessage || !movie) {
    return (
      <main className="mx-auto max-w-[1100px] px-5 py-20 text-center sm:px-10">
        <h1 className="text-2xl font-bold text-[#17191e]">
          {errorMessage ?? '영화를 찾을 수 없어요.'}
        </h1>
        <Link
          className="mt-5 inline-block text-sm font-semibold text-[#2563eb]"
          to="/"
        >
          영화 목록으로 돌아가기
        </Link>
      </main>
    )
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path)
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path)

  return (
    <main>
      <section className="relative h-[255px] overflow-hidden text-white sm:h-[310px]">
        {backdropUrl ? (
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={backdropUrl}
            alt=""
            aria-hidden="true"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#606774] text-sm text-white/80">
            이미지 없음
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/15" />

        <div className="relative mx-auto flex h-full max-w-[1100px] flex-col justify-end px-5 pb-8 sm:px-10 sm:pb-10">
          <Link
            className="mb-auto mt-5 text-xs text-white/90 hover:underline"
            to="/"
          >
            ← 영화 목록
          </Link>
          <p className="text-xs text-white/80">{movie.original_title}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-4xl">
            {movie.title}
          </h1>
          <p className="mt-1 text-xs text-white/80">
            {movie.release_date} · {formatRuntime(movie.runtime)}
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1100px] gap-8 px-5 py-8 sm:grid-cols-[180px_minmax(0,1fr)_220px] sm:px-10 sm:py-10">
        {posterUrl ? (
          <img
            className="w-[140px] rounded-lg shadow-md sm:w-full"
            src={posterUrl}
            alt={`${movie.title} 포스터`}
          />
        ) : (
          <div className="flex h-[210px] w-[140px] items-center justify-center rounded-lg bg-[#e3e6eb] text-sm text-[#606774] sm:h-full sm:w-full">
            이미지 없음
          </div>
        )}

        <div>
          <h2 className="text-base font-bold text-[#17191e]">
            {movie.tagline || '태그라인 정보가 없어요.'}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#606774]">
            {movie.overview}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span
                className="rounded-full bg-[#eef1f5] px-3 py-1 text-xs text-[#606774]"
                key={genre.id}
              >
                {genre.name}
              </span>
            ))}
          </div>

          <BookmarkButton movieId={movie.id} />
        </div>

        <aside className="border-l border-[#e3e6eb] pl-5">
          <h2 className="text-sm font-bold text-[#17191e]">내 평점</h2>
          <p className="mt-2 text-lg tracking-[3px] text-[#606774]">
            ☆ ☆ ☆ ☆ ☆
          </p>
          <textarea
            className="mt-3 h-20 w-full resize-none rounded-md border border-[#e3e6eb] bg-white p-3 text-xs outline-none focus:border-[#2563eb]"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
          />
          <button
            className="mt-2 h-9 w-full rounded bg-[#17191e] text-xs font-semibold text-white"
            type="button"
          >
            평점 저장
          </button>
        </aside>
      </section>
    </main>
  )
}