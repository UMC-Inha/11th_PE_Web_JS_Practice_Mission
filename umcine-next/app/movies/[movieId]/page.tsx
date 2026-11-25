import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MovieDetailPage } from "@/src/screens/movies/movie-detail-page";

export const metadata: Metadata = { title: "영화 상세" };

interface MovieRouteProps {
  params: Promise<{ movieId: string }>;
}

export default async function MovieRoute({ params }: MovieRouteProps) {
  const { movieId } = await params;
  const id = Number(movieId);

  if (!/^\d+$/.test(movieId) || !Number.isSafeInteger(id) || id < 1) {
    notFound();
  }

  return <MovieDetailPage movieId={id} />;
}
