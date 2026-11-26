"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthHydrated, useAuthStore } from "@/stores/auth-store";

// TanStack _auth.tsx의 beforeLoad 대체: 로그인하지 않았다면 /login으로 보낸다.
// 토큰은 localStorage에 있어 서버가 알 수 없으므로, 복원(hydrate)이 끝난 뒤 브라우저에서 판단한다.
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (hydrated && !accessToken) router.replace("/login");
  }, [hydrated, accessToken, router]);

  if (!hydrated || !accessToken) return null;
  return children;
}
