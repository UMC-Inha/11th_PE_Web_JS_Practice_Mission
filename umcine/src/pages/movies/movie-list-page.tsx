import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { getTmdbImageUrl } from "../../utils/movies/tmbd-images";

const MOVIES_PER_PAGE = 10;

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page: 1 }],
    queryFn: () => getMovies({ page: 1 }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.max(1, Math.ceil(movies.length / MOVIES_PER_PAGE));
  const pagedMovies = movies
    .slice((page - 1) * MOVIES_PER_PAGE, page * MOVIES_PER_PAGE)
    .map((movie) => ({
      id: movie.id,
      title: movie.title,
      originalTitle: movie.original_title,
      overview: movie.overview,
      tagline: "",
      posterPath: getTmdbImageUrl(movie.poster_path),
      backdropPath: getTmdbImageUrl(movie.backdrop_path),
      releaseDate: movie.release_date,
      genres: [],
      runtime: "",
    }));

  return (
    <main className="mx-auto flex max-w-[1440px] flex-col items-start gap-5 px-20 py-6">
      <h1 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-[#17191E]">
        영화 목록
      </h1>
      {moviesQuery.isPending ? (
        <p className="self-stretch py-20 text-center text-sm text-[#606774]">
          영화 목록을 불러오는 중이에요.
        </p>
      ) : moviesQuery.isError ? (
        <p className="self-stretch py-20 text-center text-sm text-[#606774]">
          영화 목록을 불러오지 못했어요.
        </p>
      ) : movies.length === 0 ? (
        <p className="self-stretch py-20 text-center text-sm text-[#606774]">
          표시할 영화가 없어요.
        </p>
      ) : (
        <>
          <MovieGrid movies={pagedMovies} />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </main>
  );
}
