import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireAuth } from "../utils/auth/require-auth";

// 로그인 후에만 들어갈 수 있는 페이지를 묶는 공통 레이아웃
// _ 로 시작해서 URL에는 나타나지 않음 (/me, /me/edit 그대로)
export const Route = createFileRoute("/_auth")({
  beforeLoad: requireAuth, // 하위 페이지 전부에 한 번만 적용
  component: () => <Outlet />,
});
