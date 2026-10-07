import { useState } from "react";
import Header from "./components/layout/header";
import MovieGrid from "./components/movies/movie-grid";
import Pagination from "./components/movies/pagination";
import { movies } from "./data/movies";
import "./App.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);

  const moviesPerPage = 10;
  const totalPages = Math.ceil(movies.length / moviesPerPage);
  const startIndex = (currentPage - 1) * moviesPerPage;
  const currentMovies = movies.slice(
    startIndex,
    startIndex + moviesPerPage,
  );

  return (
    <>
      <Header />

      <main>
        <h1 id="movies">영화 목록</h1>

        <MovieGrid
          movies={currentMovies}
        />

        {totalPages > 1 && (
  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={setCurrentPage}
  />
)}
      </main>
    </>
  );
}
