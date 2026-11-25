
import { Suspense } from "react";
import { MovieListPage } from "@/src/screens/movies/movie-list-page";
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
async function MovieList({ searchParams }: { searchParams: SearchParams }) {
  const value = (await searchParams).page;
  const requestedPage = typeof value === "string" ? Number(value) : NaN;
  const page = Number.isInteger(requestedPage) && requestedPage >= 1 && requestedPage <= 500
    ? requestedPage : 1;
  return <MovieListPage page={page} />;
}
export default function Page(props: { searchParams: SearchParams }) {
  return <Suspense fallback={<main className="flex-1 px-5 py-12" role="status">영화 목록을 불러오는 중이에요.</main>}>
    <MovieList {...props} />
  </Suspense>;
}
