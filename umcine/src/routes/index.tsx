import { createFileRoute } from "@tanstack/react-router";
import { MovieListPage } from "../pages/movies/movie-list-page";

export const Route = createFileRoute("/")({
  //파일 기반 라우팅 문법으로, 파일 경로가 src/routes/index.tsx이면 자동으로 "/" 경로로 매핑된다.
  component: MovieListPage,
  //__root.tsx의 <Outlet /> 빈자리에 주소가 /일 때 갈아끼워질 실제 본문으로 MovieListPage를 지정한다.
});

//autoCodeSplitting 옵션을 켜면 이 페이지를 chunk로 분리해놨다가, 주소가 /일 때만 이 chunk를 불러와서 렌더링한다. (즉, 초기 로딩 속도가 빨라진다.)