import { Link } from '@tanstack/react-router'
import type { Movie } from '../../types/movie'
import { cn } from '../../utils/cn'

interface MovieCardProps {
  movie: Movie
  onToggleBookmark: (movieId: number) => void
}

export default function MovieCard({
                                    movie,
                                    onToggleBookmark,
                                  }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img
            className="block aspect-[2/3] w-full rounded-lg object-cover"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>

        <button
          className={cn(
            'absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-lg p-0 shadow-[0_2px_8px_rgb(23_25_30_/_12%)]',
            movie.isBookmarked
              ? 'border border-[#2563eb] bg-[#2563eb]'
              : 'border border-white/90 bg-black/60',
          )}
          type="button"
          onClick={() => onToggleBookmark(movie.id)}
          aria-pressed={movie.isBookmarked}
          aria-label={movie.isBookmarked ? '북마크 해제' : '북마크 추가'}
        >
          <img
            className="h-5 w-5 brightness-0 invert"
            src={movie.isBookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'}
            alt=""
          />
        </button>
      </div>

      <h2 className="mt-[9px] text-sm leading-[1.4]">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {movie.title}
        </Link>
      </h2>

      <p className="mt-1 text-xs text-[#969da8]">
        {movie.releaseDate}
      </p>
    </article>
  )
}
