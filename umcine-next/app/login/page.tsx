import type { Metadata } from "next";
import GuestGuard from "@/src/components/guest-guard";
import { LoginPage } from "@/src/screens/auth/login-page";

export const metadata: Metadata = { title: "로그인" };

export default function LoginRoute() {
  return (
    <GuestGuard>
      <LoginPage />
    </GuestGuard>
  );
}
