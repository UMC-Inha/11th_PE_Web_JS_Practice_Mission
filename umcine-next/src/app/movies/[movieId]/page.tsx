import { Suspense } from "react";
import { MovieDetailPage } from "../../../screens/movies/movie-detail-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "영화 상세",
};
export default function MovieDetailRoute() {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <MovieDetailPage />
    </Suspense>
  );
}