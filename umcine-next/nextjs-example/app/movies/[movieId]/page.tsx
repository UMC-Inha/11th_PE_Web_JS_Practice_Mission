
import { Suspense } from "react";
import { MovieDetailPage } from "@/src/screens/movies/movie-detail-page";
async function Movie({ params }: { params: Promise<{ movieId: string }> }) {
  const { movieId } = await params;
  return <MovieDetailPage movieId={movieId} />;
}
export default function Page(props: { params: Promise<{ movieId: string }> }) {
  return <Suspense fallback={<main className="flex-1 px-5 py-12" role="status">영화 정보를 불러오는 중이에요.</main>}>
    <Movie {...props} />
  </Suspense>;
}
