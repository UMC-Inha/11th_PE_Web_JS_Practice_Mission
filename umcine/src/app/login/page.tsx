import { AuthGuard } from "../../components/auth/auth-guard";
import { LoginPage } from "../../views/auth/login-page";

export default function Page() {
  // 이미 로그인한 사용자는 로그인 폼 대신 홈으로 보냄
  return (
    <AuthGuard requireAuth={false}>
      <LoginPage />
    </AuthGuard>
  );
}
