import type { Metadata } from "next";
import { Suspense } from "react";
import { MovieDetail } from "@/app/components/movies/movie-detail";

export const metadata: Metadata = {
  title: "영화 상세",
  description: "영화의 줄거리와 평점을 확인하세요.",
};

interface MoviePageProps {
  params: Promise<{ movieId: string }>;
}

// params는 요청을 받아야 알 수 있는 값이므로 Suspense 경계 안에서 await 한다.
export default function MoviePage({ params }: MoviePageProps) {
  return (
    <Suspense fallback={<p className="px-8 py-16 text-center text-gray-500">영화 정보를 불러오는 중이에요.</p>}>
      <MovieScreen params={params} />
    </Suspense>
  );
}

async function MovieScreen({ params }: MoviePageProps) {
  const { movieId } = await params;
  return <MovieDetail movieId={movieId} />;
}
