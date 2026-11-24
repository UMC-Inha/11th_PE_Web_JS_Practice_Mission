"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/auth-store";

export function GuestOnly({ children }: { children: ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  // 이미 로그인한 사용자는 홈으로 보냄
  useEffect(() => {
    if (useAuthStore.getState().accessToken) {
      router.replace("/");
    }
  }, [accessToken, router]);

  return <div className={accessToken ? "hidden" : "contents"}>{children}</div>;
}