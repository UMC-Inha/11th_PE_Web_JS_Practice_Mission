import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { useFavoritesQuery } from "../../hooks/use-favorites-query";
import { useAuthStore } from "../../stores/auth-store";
import { getAuthMemberId } from "../../utils/auth-member-id";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { MovieImage } from "./movie-image";

export function FavoriteMovies() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getAuthMemberId(accessToken);
  const favorites = useFavoritesQuery(memberId);

  return (
    <section aria-labelledby="favorites-title" className="mt-12">
      <h2 id="favorites-title" className="mb-4 text-xl font-bold">즐겨찾기</h2>
      {memberId === null ? <p>로그인한 회원 정보를 확인할 수 없어요.</p> :
        favorites.isPending ? <p role="status">즐겨찾기를 불러오는 중이에요.</p> :
        favorites.isError && !favorites.data ? (
          <div className="space-y-2">
            <p role="alert">즐겨찾기를 불러오지 못했어요.</p>
            <button type="button" onClick={() => void favorites.refetch()} className="text-sm font-semibold text-blue-700">다시 시도</button>
          </div>
        ) : favorites.data?.length ? (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {favorites.data.map((favorite) => (
              <li key={favorite.favoriteId}>
                <FavoriteMovie movieId={Number(favorite.movieId)} />
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-[#677080]">즐겨찾기한 영화가 없어요.</p>}
    </section>
  );
}

function FavoriteMovie({ movieId }: { movieId: number }) {
  const movie = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    staleTime: 30 * 1000,
  });
  const title = movie.data?.title ?? `영화 #${movieId}`;

  return (
    <Link to="/movies/$movieId" params={{ movieId: String(movieId) }} className="block rounded-lg bg-white p-3 text-sm font-semibold">
      <MovieImage src={getTmdbPosterUrl(movie.data?.poster_path ?? null)} alt=""
        className="aspect-2/3 w-full rounded-md object-cover" />
      <p className="mt-2">{title}</p>
    </Link>
  );
}
