"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthHydrated, useAuthStore } from "@/stores/auth-store";

// TanStack login.tsx의 beforeLoad 대체: 이미 로그인한 사용자는 홈으로 보낸다.
export function GuestGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (hydrated && accessToken) router.replace("/");
  }, [hydrated, accessToken, router]);

  if (hydrated && accessToken) return null;
  return children;
}
