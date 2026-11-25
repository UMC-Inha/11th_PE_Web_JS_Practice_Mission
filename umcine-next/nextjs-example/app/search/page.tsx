
import { Suspense } from "react";
import { SearchPage } from "@/src/screens/movies/search-page";
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
async function Search({ searchParams }: { searchParams: SearchParams }) {
  const value = (await searchParams).query;
  return <SearchPage query={typeof value === "string" ? value : undefined} />;
}
export default function Page(props: { searchParams: SearchParams }) {
  return <Suspense fallback={<main className="flex-1 px-5 py-12" role="status">검색 화면을 불러오는 중이에요.</main>}>
    <Search {...props} />
  </Suspense>;
}
