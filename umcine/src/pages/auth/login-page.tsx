import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { cn } from "../../utils/cn";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit = isEmailValid && password.length > 0;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setNotice("로그인 기능은 준비 중이에요.");
  }

  return (
    <main className="flex flex-1 justify-center px-5 pt-10 pb-20 sm:pt-20 lg:pt-26">
      <section className="w-full max-w-108" aria-labelledby="login-title">
        <h1 id="login-title" className="mb-5 text-3xl font-bold tracking-tight">로그인</h1>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="login-email" className="mb-2 block text-sm font-semibold">이메일</label>
            <input id="login-email" type="email" autoComplete="email" required value={email}
              placeholder="name@example.com" onChange={(event) => { setEmail(event.target.value); setNotice(""); }}
              aria-invalid={email.length > 0 && !isEmailValid}
              aria-describedby={email.length > 0 && !isEmailValid ? "login-email-error" : undefined}
              className="h-12 w-full rounded-lg border border-[#dce1e8] bg-white px-4 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
            {email.length > 0 && !isEmailValid && <p id="login-email-error" role="alert" className="mt-1.5 text-xs text-red-600">이메일 형식을 확인해 주세요.</p>}
          </div>
          <div>
            <label htmlFor="login-password" className="mb-2 block text-sm font-semibold">비밀번호</label>
            <input id="login-password" type="password" autoComplete="current-password" required value={password}
              placeholder="비밀번호를 입력해 주세요" onChange={(event) => { setPassword(event.target.value); setNotice(""); }}
              className="h-12 w-full rounded-lg border border-[#dce1e8] bg-white px-4 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
          </div>
          <button disabled={!canSubmit} className={cn("h-12 w-full rounded-lg text-sm font-bold text-white", canSubmit ? "bg-[#2864fa] hover:bg-blue-700" : "cursor-not-allowed bg-[#2864fa]/45")}>로그인</button>
          {notice && <p role="status" className="text-center text-sm text-[#677080]">{notice}</p>}
        </form>
        <p className="mt-4 text-center text-xs text-[#788191]">아직 계정이 없나요? <Link to="/signup" className="font-semibold text-[#2864fa]">회원가입</Link></p>
      </section>
    </main>
  );
}