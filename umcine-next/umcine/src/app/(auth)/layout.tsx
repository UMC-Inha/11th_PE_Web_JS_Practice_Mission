import { RequireAuth } from "@/components/auth/require-auth";

// 기존 routes/_auth.tsx
// (auth) 처럼 괄호로 감싼 폴더는 URL에 나타나지 않음 (/me, /me/edit 그대로)
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}
