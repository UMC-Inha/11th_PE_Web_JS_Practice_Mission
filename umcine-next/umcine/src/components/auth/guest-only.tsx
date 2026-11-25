"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

// 로그인한 사용자는 들어올 필요 없는 페이지(로그인)에서 홈으로 보냄
export function GuestOnly({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (hasHydrated && accessToken) router.replace("/");
  }, [hasHydrated, accessToken, router]);

  if (!hasHydrated || accessToken) return null;
  return children;
}
