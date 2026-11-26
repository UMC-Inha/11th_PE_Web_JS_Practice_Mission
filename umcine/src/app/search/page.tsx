import { Suspense } from "react";
import { SearchPage } from "../../screens/movies/search-page";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="py-16 text-center text-sm text-[#606774]">
          검색 페이지를 불러오는 중이에요.
        </main>
      }
    >
      <SearchPage />
    </Suspense>
  );
}
