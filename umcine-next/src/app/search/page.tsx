import { Suspense } from "react";
import { SearchPage } from "../../screens/movies/search-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "검색",
};
export default function SearchRoute() {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <SearchPage />
    </Suspense>
  );
}