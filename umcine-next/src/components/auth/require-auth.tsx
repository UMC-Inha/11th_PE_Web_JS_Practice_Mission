"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/auth-store";

export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  // 브라우저에 저장된 실제 토큰을 확인하고, 없으면 로그인 페이지로 보냄
  useEffect(() => {
    if (!useAuthStore.getState().accessToken) {
      router.replace("/login");
    }
  }, [accessToken, router]);

  return <div className={accessToken ? "contents" : "hidden"}>{children}</div>;
}