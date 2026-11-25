import { useState, type SubmitEvent } from "react";
import { Link, Navigate } from "@tanstack/react-router";
import { HTTPError } from "ky";
import { ApiConfigurationError } from "../../config/env";
import { useAuthStore } from "../../stores/auth-store";
import { useLoginMutation } from "../../hooks/use-login-mutation";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const loginMutation = useLoginMutation();
  const token = useAuthStore((state) => state.accessToken);
  const validEmail = EMAIL_REGEX.test(form.email.trim());
  const canSubmit = validEmail && form.password.length > 0;
  const error = loginMutation.error;
  const errorMessage = error instanceof ApiConfigurationError
    ? error.message
    : error instanceof HTTPError && [400, 401, 403].includes(error.response.status)
    ? "이메일 또는 비밀번호를 확인해 주세요."
    : "로그인에 실패했어요. 잠시 후 다시 시도해 주세요.";

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  }

  if (token) return <Navigate to="/" replace />;
  return (
    <main className="flex min-h-[calc(100vh-180px)] items-center justify-center px-5 py-20">
      <section className="w-full max-w-[428px]" aria-labelledby="login-title">
        <h1 id="login-title" className="mb-6 text-[32px] font-bold tracking-tight">로그인</h1>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="login-email" className="mb-2 block text-sm font-bold">이메일</label>
            <div className="relative">
              <img src="/icons/mail.svg" alt="" className="absolute left-4 top-4 h-4 w-4" />
              <input id="login-email" type="email" autoComplete="email" placeholder="name@example.com" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); loginMutation.reset(); }} disabled={loginMutation.isPending} className="account-input pl-10" aria-invalid={form.email.length > 0 && !validEmail} aria-describedby={form.email.length > 0 && !validEmail ? "login-email-error" : undefined} />
            </div>
            {form.email.length > 0 && !validEmail && <p id="login-email-error" className="mt-2 text-xs text-red-500">이메일 형식을 확인해 주세요.</p>}
          </div>
          <div>
            <label htmlFor="login-password" className="mb-2 block text-sm font-bold">비밀번호</label>
            <div className="relative">
              <img src="/icons/lock.svg" alt="" className="absolute left-4 top-4 h-4 w-4" />
              <input id="login-password" type="password" autoComplete="current-password" placeholder="비밀번호" value={form.password} onChange={(e) => { setForm({ ...form, password: e.target.value }); loginMutation.reset(); }} disabled={loginMutation.isPending} className="account-input pl-10" />
            </div>
          </div>
          {loginMutation.isError && <p role="alert" className="text-sm text-red-500">{errorMessage}</p>}
          <button type="submit" disabled={!canSubmit || loginMutation.isPending} className="account-primary w-full">{loginMutation.isPending ? "로그인 중" : "로그인"}</button>
        </form>
        <p className="mt-6 text-center text-xs text-[#969da8]">처음이신가요? <Link to="/signup" className="font-bold text-blue-600">회원가입</Link></p>
      </section>
    </main>
  );
}
