import type { ReactNode } from "react";
import { AuthGuard } from "../../components/auth/auth-guard";

// 로그인 후에만 접근할 수 있는 페이지의 공통 Layout
// (protected)는 URL에 포함되지 않는 Route Group
export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <AuthGuard requireAuth>{children}</AuthGuard>;
}
