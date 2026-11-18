import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

// 로그인하지 않았으면 페이지에 들어가기 전에 로그인 페이지로 보냄
export function requireAuth() {
  // beforeLoad는 컴포넌트 밖이라 훅 대신 getState()로 읽음
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) {
    alert("로그인이 필요해요.");
    throw redirect({ to: "/login" });
  }
}
