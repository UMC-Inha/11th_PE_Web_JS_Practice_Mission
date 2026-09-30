import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "../pages/movies/search-page";

export const Route = createFileRoute("/search")({
  validateSearch: (search): { query?: string } => ({
    query: typeof search.query === "string" ? search.query : undefined,
  }),
  component: SearchPage,
});

/*
search param: /search/?query=오디세이에서 query처럼 지정한 값이 search param으로 들어온다. (query는 임의로 지정한 이름이다.)
validateSearch: search param을 검증하는 함수. URL에서 들어오는 search값을 확인하고
               search param이 query라는 이름으로 들어오면 그대로 쓰고, 아니면 undefined로 처리한다.

- 이후 상위 __root.tsx의 <Outlet /> 빈자리에 주소가 /search일 때 갈아끼워질 실제 본문으로 SearchPage를 지정한다.
*/