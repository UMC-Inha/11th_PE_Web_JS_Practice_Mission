import { GuestOnly } from "../../components/auth/guest-only";
import { LoginPage } from "../../screens/auth/login-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
};
export default function LoginRoute() {
  return (
    <GuestOnly>
      <LoginPage />
    </GuestOnly>
  );
}