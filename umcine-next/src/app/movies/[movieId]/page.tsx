import { Suspense } from "react";
import { MovieDetailPage } from "@/views/movies/movie-detail-page";

interface PageProps {
  params: Promise<{ movieId: string }>;
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-[min(1080px,100%_-_48px)] py-20">
          <p className="text-center text-sm text-[#888]">
            영화 정보를 불러오는 중이에요.
          </p>
        </main>
      }
    >
      <MovieDetailScreen params={params} />
    </Suspense>
  );
}

async function MovieDetailScreen({ params }: PageProps) {
  const { movieId } = await params;

  return <MovieDetailPage movieId={movieId} />;
}