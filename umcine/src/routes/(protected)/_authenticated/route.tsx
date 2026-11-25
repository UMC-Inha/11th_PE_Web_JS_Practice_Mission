import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../../stores/auth-store";

// 로그인 후에만 접근할 수 있는 페이지의 공통 Layout Route
// (protected)는 URL에 포함되지 않는 Route Group, _authenticated는 경로가 없는 레이아웃 라우트
export const Route = createFileRoute("/(protected)/_authenticated")({
  // 토큰이 없으면 하위 페이지를 보여 주기 전에 로그인 페이지로 보냄 (토큰 유효성은 내 정보 API가 확인)
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  // 하위 페이지(마이페이지, 내 정보 수정)를 Outlet 자리에 렌더링함
  component: Outlet,
});
