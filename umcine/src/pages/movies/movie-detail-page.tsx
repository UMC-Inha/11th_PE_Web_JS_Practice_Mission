import { Link, useParams } from '@tanstack/react-router'
import { movies } from '../../data/movies'
import { BookmarkButton } from '../../components/bookmark-button'

export function MovieDetailPage() {
  const { movieId } = useParams({ from: '/movies/$movieId' })
  const movie = movies.find((item) => item.id === Number(movieId))

  if (!movie) {
    return (
      <main className="mx-auto max-w-[1100px] px-5 py-20 text-center sm:px-10">
        <h1 className="text-2xl font-bold text-[#17191e]">영화를 찾을 수 없어요.</h1>
        <Link className="mt-5 inline-block text-sm font-semibold text-[#2563eb]" to="/">
          영화 목록으로 돌아가기
        </Link>
      </main>
    )
  }

  return (
    <main>
      <section className="relative h-[255px] overflow-hidden text-white sm:h-[310px]">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/15" />

        <div className="relative mx-auto flex h-full max-w-[1100px] flex-col justify-end px-5 pb-8 sm:px-10 sm:pb-10">
          <Link className="mb-auto mt-5 text-xs text-white/90 hover:underline" to="/">
            ← 영화 목록
          </Link>
          <p className="text-xs text-white/80">{movie.originalTitle}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-4xl">{movie.title}</h1>
          <p className="mt-1 text-xs text-white/80">{movie.releaseDate} · {movie.runtime}</p>       
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1100px] gap-8 px-5 py-8 sm:grid-cols-[180px_minmax(0,1fr)_220px] sm:px-10 sm:py-10">
        <img
          className="w-[140px] rounded-lg shadow-md sm:w-full"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />

        <div>
          <h2 className="text-base font-bold text-[#17191e]">{movie.tagline}</h2>
          <p className="mt-4 text-sm leading-7 text-[#606774]">{movie.overview}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span className="rounded-full bg-[#eef1f5] px-3 py-1 text-xs text-[#606774]" key={genre}>
                {genre}
              </span>
            ))}
          </div>
          <BookmarkButton movieId={movie.id} /> 
        </div>

        <aside className="border-l border-[#e3e6eb] pl-5">
          <h2 className="text-sm font-bold text-[#17191e]">내 평점</h2>
          <p className="mt-2 text-lg tracking-[3px] text-[#606774]">☆ ☆ ☆ ☆ ☆</p>
          <textarea
            className="mt-3 h-20 w-full resize-none rounded-md border border-[#e3e6eb] bg-white p-3 text-xs outline-none focus:border-[#2563eb]"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
          />
          <button className="mt-2 h-9 w-full rounded bg-[#17191e] text-xs font-semibold text-white" type="button">
            평점 저장
          </button>
        </aside>
      </section>
    </main>
  )
}
