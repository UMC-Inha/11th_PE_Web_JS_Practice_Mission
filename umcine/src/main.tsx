import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "./index.css";

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
