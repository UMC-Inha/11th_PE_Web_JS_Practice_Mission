import { Suspense } from "react";
import { MovieDetailPage } from "../../../src/screens/movies/movie-detail-page";

export default function Page() {
  return (
    <Suspense fallback={<main className="px-20 py-10">영화 정보를 불러오는 중...</main>}>
      <MovieDetailPage />
    </Suspense>
  );
}