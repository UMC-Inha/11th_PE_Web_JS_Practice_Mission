import type { Metadata } from "next";
import { Suspense } from "react";
import { MovieSearch } from "@/app/components/movies/movie-search";

export const metadata: Metadata = {
  title: "검색",
  description: "보고 싶은 영화를 검색하세요.",
};

// MovieSearch가 useSearchParams()로 URL의 ?query=를 읽는데, 이 값은 요청을 받아야 알 수 있어서
// Suspense 경계 안에 둔다. (Cache Components)
export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex-1 bg-gray-100" />}>
      <MovieSearch />
    </Suspense>
  );
}
