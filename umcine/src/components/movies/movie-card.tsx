import { Link } from "@tanstack/react-router";
import { BookmarkButton } from "../bookmark-button";

export interface MovieCardData {
  id: number;
  title: string;
  posterPath: string | null;
  releaseDate: string;
}

interface MovieCardProps {
  movie: MovieCardData;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {movie.posterPath ? (
            <img src={movie.posterPath} alt={`${movie.title} 포스터`} className="h-[274px] w-full rounded-[10px] object-cover" />
          ) : (
            <div className="flex h-[274px] items-center justify-center rounded-[10px] bg-gray-100 text-[#969DA8]">포스터 없음</div>
          )}
        </Link>
        <BookmarkButton movieId={movie.id} />
      </div>
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <h2 className="mt-2 text-[14px] font-bold">{movie.title}</h2>
      </Link>
      <p className="text-[12px] text-[#969DA8]">{movie.releaseDate}</p>
    </article>
  );
}
