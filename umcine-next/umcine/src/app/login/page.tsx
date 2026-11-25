import { GuestOnly } from "@/components/auth/guest-only";
import { LoginPage } from "@/views/auth/login-page";

// 기존 routes/login.tsx → /login (로그인 상태면 / 로 이동)
export default function Page() {
  return (
    <GuestOnly>
      <LoginPage />
    </GuestOnly>
  );
}
