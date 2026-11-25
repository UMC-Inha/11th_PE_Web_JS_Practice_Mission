
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/auth-store";
import { useAuthHydrated } from "../hooks/use-auth-hydrated";
export function AuthBoundary({ children, guestOnly = false }: {
  children: React.ReactNode;
  guestOnly?: boolean;
}) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const token = useAuthStore((state) => state.accessToken);
  const shouldRedirect = hydrated && (guestOnly ? Boolean(token) : !token);
  useEffect(() => {
    if (shouldRedirect) router.replace(guestOnly ? "/" : "/login");
  }, [shouldRedirect, guestOnly, router]);
  if (!hydrated || shouldRedirect) {
    return <main role="status" className="flex-1 px-5 py-12">로그인 상태를 확인하는 중이에요.</main>;
  }
  return children;
}
