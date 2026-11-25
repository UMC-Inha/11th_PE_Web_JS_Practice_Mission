import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueries, useQuery } from "@tanstack/react-query";
import Pagination from "../movies/pagination";
import PosterImage from "../movies/poster-image";
import { favoritesQueryOptions } from "../../queries/favorite-queries";
import { movieDetailQueryOptions } from "../../queries/movie-queries";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

const PAGE_SIZE = 10;

function FavoriteMovieList() {
  const [page, setPage] = useState(1);
  const {
    data: favorites,
    isPending,
    isError,
  } = useQuery(favoritesQueryOptions(true));

  const totalPages = Math.max(1, Math.ceil((favorites?.length ?? 0) / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages); // 마지막 페이지의 항목을 지웠을 때 보정
  const pageItems = (favorites ?? []).slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // 즐겨찾기 응답에는 movieId만 있어서 현재 페이지의 영화 정보를 TMDB에서 가져옴
  const movieQueries = useQueries({
    queries: pageItems.map((item) => movieDetailQueryOptions(item.movieId)),
  });

  if (isPending) {
    return (
      <p role="status" className="mt-4 text-sm text-app-text">
        즐겨찾기를 불러오는 중이에요.
      </p>
    );
  }

  if (isError) {
    return (
      <p role="alert" className="mt-4 text-sm text-app-text">
        즐겨찾기를 불러오지 못했어요.
      </p>
    );
  }

  if (favorites.length === 0) {
    return (
      <p className="mt-4 text-sm text-app-text">즐겨찾기한 영화가 없어요.</p>
    );
  }

  return (
    <>
      <ul className="m-0 mt-4 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 lg:grid-cols-5">
        {pageItems.map((item, index) => {
          const { data: movie, isPending: isMoviePending } = movieQueries[index];

          if (!movie) {
            return (
              <li key={item.favoriteId}>
                <div className="aspect-2/3 animate-pulse rounded-lg bg-app-surface" />
                <p className="mt-2 text-xs text-gray-400">
                  {isMoviePending
                    ? "영화 정보를 불러오는 중이에요."
                    : "영화 정보를 불러오지 못했어요."}
                </p>
              </li>
            );
          }

          return (
            <li key={item.favoriteId}>
              <Link
                to="/movies/$movieId"
                params={{ movieId: String(movie.id) }}
                className="block no-underline"
              >
                <div className="aspect-2/3 overflow-hidden rounded-lg bg-app-surface">
                  <PosterImage
                    className="block h-full w-full object-cover"
                    src={getTmdbPosterUrl(movie.poster_path)}
                    alt={movie.title}
                  />
                </div>
                <p className="mt-2 truncate text-sm font-bold text-app-text-h">
                  {movie.title}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {movie.release_date
                    ? movie.release_date.replaceAll("-", ".")
                    : "개봉일 미정"}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
}

export default FavoriteMovieList;
