import { useState } from "react";
import { Link } from "@tanstack/react-router";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = email.trim().length > 0 && password.length > 0;

  return (
    <main className="flex flex-1 items-center justify-center bg-[#f6f7f9] px-5 py-12">
      <form
        className="w-full max-w-[430px]"
        onSubmit={(e) => e.preventDefault()}
      >
        <h1 className="mb-5 text-[32px] leading-10 font-bold">
          로그인
        </h1>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="mb-2 block text-xs font-bold"
            >
              이메일
            </label>

            <div className="flex h-12 items-center gap-3 rounded-lg border border-[#dfe3ea] bg-white px-4 focus-within:border-blue-600">
              <img src="/icons/mail.svg" alt="" />
              <input
                id="login-email"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-2 block text-xs font-bold"
            >
              비밀번호
            </label>

            <div className="flex h-12 items-center gap-3 rounded-lg border border-[#dfe3ea] bg-white px-4 focus-within:border-blue-600">
              <img src="/icons/lock.svg" alt="" />
              <input
                id="login-password"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button
          className="mt-4 h-12 w-full rounded-lg bg-[#2563eb] text-sm font-bold text-white disabled:cursor-not-allowed"
          type="submit"
          disabled={!canSubmit}
        >
          로그인
        </button>

        <p className="mt-4 text-center text-xs text-[#667085]">
          계정이 없으신가요?{" "}
          <Link to="/signup" className="font-semibold text-blue-600">
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}