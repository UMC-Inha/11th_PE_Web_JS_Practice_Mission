import { Suspense } from "react";
import { SearchPage } from "../../views/movies/search-page";

export default function Page() {
  // SearchPage가 useSearchParams로 검색어를 읽으므로 Suspense로 감쌈
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  );
}
