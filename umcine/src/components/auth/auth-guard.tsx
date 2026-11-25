"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthHydrated, useAuthStore } from "../../stores/auth-store";

interface AuthGuardProps {
  // true: 로그인한 사용자만, false: 로그인하지 않은 사용자만 보여 줌
  requireAuth: boolean;
  children: ReactNode;
}

// 토큰은 localStorage에 있어 서버가 알 수 없으므로, 브라우저에서 복원한 뒤에 접근을 확인함
// (토큰 유효성은 내 정보 API가 확인)
export function AuthGuard({ requireAuth, children }: AuthGuardProps) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const hasToken = useAuthStore((state) => state.accessToken !== null);
  const isAllowed = hasToken === requireAuth;

  useEffect(() => {
    if (hydrated && !isAllowed) {
      router.replace(requireAuth ? "/login" : "/");
    }
  }, [hydrated, isAllowed, requireAuth, router]);

  if (!hydrated || !isAllowed) return null;

  return children;
}
