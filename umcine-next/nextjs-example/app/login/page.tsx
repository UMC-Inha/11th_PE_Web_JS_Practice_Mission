import { LoginPage } from "@/src/screens/auth/login-page";
import { AuthBoundary } from "@/src/components/auth-boundary";
export default function Page() {
  return <AuthBoundary guestOnly><LoginPage /></AuthBoundary>;
}
