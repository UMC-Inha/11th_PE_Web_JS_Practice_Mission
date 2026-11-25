import { Suspense } from "react";
import { MovieListPage } from "@/views/movies/movie-list-page";

export default function Page() {
  return (
    <Suspense
      fallback={
        <p className="py-20 text-center text-sm text-[#888]">
          영화 목록을 불러오는 중이에요.
        </p>
      }
    >
      <MovieListPage />
    </Suspense>
  );
}