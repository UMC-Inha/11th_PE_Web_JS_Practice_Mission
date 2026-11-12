import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";
import Footer from "../components/footer";

export const Route = createRootRoute({
  component: () => (
    // 화면 높이만큼 세로로 채우기
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* 남는 공간을 내용 영역이 전부 차지 → 푸터가 맨 아래로 밀려남 */}
      <div className="flex flex-1 flex-col bg-gray-50 [&>main]:flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  ),
  notFoundComponent: () => <main>페이지를 찾을 수 없어요.</main>,
});