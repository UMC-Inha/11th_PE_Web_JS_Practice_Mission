import type { Metadata } from "next";
import { SearchPage } from "@/src/screens/movies/search-page";

export const metadata: Metadata = { title: "영화 검색" };

interface SearchRouteProps {
  searchParams: Promise<{ query?: string | string[] }>;
}

export default async function SearchRoute({ searchParams }: SearchRouteProps) {
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query : "";

  return <SearchPage key={query} query={query} />;
}
