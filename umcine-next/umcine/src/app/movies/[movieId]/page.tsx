import { Suspense } from "react";
import { MovieDetailPage } from "@/views/movies/movie-detail-page";

interface MovieDetailRouteProps {
  params: Promise<{ movieId: string }>;
}

// 기존 routes/movies.$movieId.tsx → /movies/:movieId
// params는 요청이 와야 알 수 있는 값이라 cacheComponents 설정에서는 Suspense 안에서 읽어야 함
export default function Page({ params }: MovieDetailRouteProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-[1440px] px-20 py-24 text-center text-sm text-[#606774]">
          영화 정보를 불러오는 중이에요.
        </main>
      }
    >
      <MovieDetailRoute params={params} />
    </Suspense>
  );
}

async function MovieDetailRoute({ params }: MovieDetailRouteProps) {
  const { movieId } = await params;
  return <MovieDetailPage movieId={Number(movieId)} />;
}
