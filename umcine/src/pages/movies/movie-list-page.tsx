import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";

import { Footer } from "../../components/layout/footer";
import { MovieGrid } from "../../components/movies/movie-grid";

export function MovieListPage() {

  //6.1 
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [errorMessage, setErrorMessage] = useState<string | null>(null);

useEffect(() => {
  let ignore = false;
  async function loadMovies() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getMovies({ page: 1 });
      if (!ignore) setMovies(response.results);
    } catch {
      if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
    } finally {
      if (!ignore) setIsLoading(false);
    }
  }

  loadMovies();

  return () => {
    ignore = true;
  };
}, []);


  //6.1 UI 순서: 로딩 → 오류 → 빈 결과 → 성공 (로딩 중 movies가 []라 isLoading을 먼저 검사)
  let content;
  if (isLoading) {
    content = <p className="p-8 text-gray-500">영화 목록을 불러오는 중이에요.</p>;
  } else if (errorMessage) {
    content = <p className="p-8 text-red-500">{errorMessage}</p>;
  } else if (movies.length === 0) {
    content = <p className="p-8 text-gray-500">조건에 맞는 영화가 없어요.</p>;
  } else {
    content = <MovieGrid movies={movies} />;
  }

  return (
    <>
      {content}
      <Footer />
    </>
  );
}

//Footer가 고정이 아니므로 이렇게 추가해주는 것이 맞는 듯 하다.