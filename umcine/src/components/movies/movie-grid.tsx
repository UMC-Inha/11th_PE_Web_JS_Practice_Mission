import { movies } from "../../data/movies";
import { MovieCard } from "./movie-card";
import { Pagination } from "./pagination";

// CSS Module(movie-grid.module.css)에서 Tailwind 유틸리티 클래스로 전환
// 북마크 상태는 MovieCard 안의 BookmarkButton이 zustand store(useBookmarkStore)로 직접 관리함
export function MovieGrid() {
  return (
    <section className="p-4 text-left sm:p-8">
      <h2 className="mb-4 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl">
        영화 목록
      </h2>

      {/* 반응형 열 수: 모바일 2 → sm 3 → md 4 → lg 5 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <Pagination />
    </section>
  );
}
