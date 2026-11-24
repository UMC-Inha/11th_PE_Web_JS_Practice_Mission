import { SignupPage } from "../../screens/auth/signup-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입",
};
export default function SignupRoute() {
  return <SignupPage />;
}