"use client";

import { useState, type SubmitEvent } from "react";
import Link from "next/link";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldClass =
  "flex h-11 items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 focus-within:border-app-accent";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLoginMutation();
  const canSubmit = EMAIL_REGEX.test(email.trim()) && password.length > 0;

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({ email: email.trim(), password });
  };

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-[378px]">
        <h1 className="mb-4 text-[32px] font-extrabold leading-tight text-app-text-h">
          로그인
        </h1>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-2">
            <span className="text-[13px] font-bold text-app-text-h">이메일</span>
            <div className={fieldClass}>
              <img
                className="h-4 w-4 opacity-60"
                src="/icons/mail.svg"
                alt=""
                aria-hidden="true"
              />
              <input
                type="email"
                className="min-w-0 flex-1 border-none bg-transparent text-sm text-app-text-h outline-none placeholder:text-gray-400"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[13px] font-bold text-app-text-h">
              비밀번호
            </span>
            <div className={fieldClass}>
              <img
                className="h-4 w-4 opacity-60"
                src="/icons/lock.svg"
                alt=""
                aria-hidden="true"
              />
              <input
                type="password"
                className="min-w-0 flex-1 border-none bg-transparent text-sm text-app-text-h outline-none placeholder:text-gray-400"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </label>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || loginMutation.isPending}
          className="mt-4 h-10 w-full rounded-lg border-none bg-app-accent text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>

        <p className="mt-4 text-center text-xs text-app-text">
          처음이신가요?{" "}
          <Link href="/signup" className="font-bold text-app-accent no-underline">
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}
