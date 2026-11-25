"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

// TanStack의 beforeLoad + redirect 대신 쓰는 클라이언트 가드
// 토큰이 localStorage에 있어서 서버(proxy.ts)에서는 로그인 여부를 알 수 없음
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const wasLoggedIn = useRef(false);
  const hasRedirected = useRef(false);

  useEffect(() => {
    // localStorage를 다 읽기 전에 판단하면 로그인 상태여도 쫓겨남
    if (!hasHydrated) return;
    if (accessToken) {
      wasLoggedIn.current = true;
      hasRedirected.current = false;
      return;
    }
    // 개발 모드(StrictMode)에서 effect가 두 번 실행돼도 alert은 한 번만
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    if (wasLoggedIn.current) {
      // 이 페이지에서 로그아웃한 경우: 안내 없이 홈으로
      router.replace("/");
      return;
    }
    alert("로그인이 필요해요.");
    router.replace("/login");
  }, [hasHydrated, accessToken, router]);

  if (!hasHydrated || !accessToken) return null;
  return children;
}
