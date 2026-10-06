import { Link } from "@tanstack/react-router"
import type { Movie } from "../../types/movie";
import { cn } from  "../../utils/cn";


interface MovieCardProps {
  movie: Movie;
  onBookmarkToggle: (movieId: number) => void;
}

export function MovieCard({ movie, onBookmarkToggle }: MovieCardProps) {
  const bookmarkIcon = movie.isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg";
  const bookmarkLabel = movie.isBookmarked ? "북마크 해제" : "북마크 추가";

  return (
    <article className="movie-card overflow-hidden rounded-[10px] bg-white min-w-0 group">
      <div className="poster-wrap relative aspect-2/3 overflow-hidden rounded-sm bg-[#dedce3]">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img 
            className="movie-poster block w-full h-full object-cover transition-transform duration-180 ease-[ease] group-hover:scale-[1.015]"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`} />
        </Link>
          <button className={cn(
            "bookmark-button absolute size-6 right-2 top-2 rounded-[3px] p-0 text-white grid place-items-center border-0",
            movie.isBookmarked
              ? "bg-blue-600"
              : "bg-black/60 hover:bg-black/18",)} type="button" onClick={() => onBookmarkToggle(movie.id)} aria-label={`${movie.title} ${bookmarkLabel}`} aria-pressed={movie.isBookmarked}>
            <img className="size-5 invert" src={bookmarkIcon} alt="" />
          </button>
      </div>
      <div className="movie-info pt-1.75">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <h2 className="mb-1 truncate text-[11px] font-bold leading-[1.35] text-[#222]">{movie.title}</h2>
          <p className="m-0 text-[10px] text-[#8a8a8a]">{movie.releaseDate}</p>
        </Link>
      </div>
    </article>
  );
}
