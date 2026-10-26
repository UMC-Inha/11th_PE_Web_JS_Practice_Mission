import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css"; //Pretendard 가변 폰트 로드(npm 패키지, CDN 의존 없음). 적용은 index.css의 --font-sans
import "./index.css";

//localStorage.removeItem("umcine-bookmarks"); //[일회용] 옛 북마크 키 정리. 개발자도구에서 사라진 걸 확인한 뒤 이 줄은 삭제할 것

const router = createRouter({ routeTree });
//routeTree.gen.ts에서 routeTree를 가져와서 router를 생성하고, RouterProvider로 감싸서 앱 전체에 라우터를 제공한다.
//createRouter에 이 지도를 넘겨줌으로써 라우터가 "우리 앱에 어떤 URL들이 존재하는지" 전부 파악하게 됩니다

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
//router가 url을 감시하다가 주소가 바뀌면 outlet 자리에 해당하는 컴포넌트를 렌더링해준다.

//router 컴포넌트를 StrictMode로 감싸서 렌더링.
//StrictMode는 개발 모드에서만 활성화되며, 잠재적인 문제를 감지하고 경고를 표시하는 데 도움을 준다.
