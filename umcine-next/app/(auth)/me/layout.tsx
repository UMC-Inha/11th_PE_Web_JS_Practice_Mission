import type { ReactNode } from "react";
import { AuthGuard } from "@/app/components/auth/auth-guard";

// /me 아래 모든 페이지는 로그인이 필요하다. layout은 Server Component로 두고 가드만 Client로 분리했다.
export default function MeLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
