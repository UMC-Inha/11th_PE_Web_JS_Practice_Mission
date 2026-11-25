import { Suspense } from "react";
import { SearchPage } from "@/views/movies/search-page";

interface SearchRouteProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// 기존 routes/search.tsx → /search?query=
// searchParams도 요청 시점 값이라 Suspense 안에서 읽음
export default function Page({ searchParams }: SearchRouteProps) {
  return (
    <Suspense fallback={<main className="mx-auto max-w-[1440px]" />}>
      <SearchRoute searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchRoute({ searchParams }: SearchRouteProps) {
  const { query } = await searchParams;
  // validateSearch 대신: 문자열일 때만 검색어로 사용
  return <SearchPage query={typeof query === "string" ? query : undefined} />;
}
