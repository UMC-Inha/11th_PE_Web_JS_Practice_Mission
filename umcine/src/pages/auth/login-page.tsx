import { useState, type SubmitEvent } from "react";
import { Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { login } from "../../api/auth/login";
import { useAuthStore } from "../../stores/auth-store";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const token = useAuthStore((state) => state.accessToken);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit = validEmail && password.length > 0 && !isSubmitting;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    setError("");
    try {
      const session = await login({ email: email.trim(), password });
      queryClient.removeQueries({ queryKey: ["member"] });
      useAuthStore.getState().login(session);
      await navigate({ to: "/me" });
    } catch (error) {
      setError(error instanceof HTTPError && [400, 401, 403].includes(error.response.status)
        ? "이메일 또는 비밀번호를 확인해 주세요."
        : "로그인에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (token) return <Navigate to="/me" replace />;
  return (
    <main className="flex min-h-[calc(100vh-180px)] items-center justify-center px-5 py-20">
      <section className="w-full max-w-[428px]" aria-labelledby="login-title">
        <h1 id="login-title" className="mb-6 text-[32px] font-bold tracking-tight">로그인</h1>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="login-email" className="mb-2 block text-sm font-bold">이메일</label>
            <div className="relative">
              <img src="/icons/mail.svg" alt="" className="absolute left-4 top-4 h-4 w-4" />
              <input id="login-email" type="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} disabled={isSubmitting} className="account-input pl-10" aria-invalid={email.length > 0 && !validEmail} aria-describedby={email.length > 0 && !validEmail ? "login-email-error" : undefined} />
            </div>
            {email.length > 0 && !validEmail && <p id="login-email-error" className="mt-2 text-xs text-red-500">이메일 형식을 확인해 주세요.</p>}
          </div>
          <div>
            <label htmlFor="login-password" className="mb-2 block text-sm font-bold">비밀번호</label>
            <div className="relative">
              <img src="/icons/lock.svg" alt="" className="absolute left-4 top-4 h-4 w-4" />
              <input id="login-password" type="password" autoComplete="current-password" placeholder="비밀번호" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} disabled={isSubmitting} className="account-input pl-10" />
            </div>
          </div>
          {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={!canSubmit} className="account-primary w-full">{isSubmitting ? "로그인 중" : "로그인"}</button>
        </form>
        <p className="mt-6 text-center text-xs text-[#969da8]">처음이신가요? <Link to="/signup" className="font-bold text-blue-600">회원가입</Link></p>
      </section>
    </main>
  );
}
