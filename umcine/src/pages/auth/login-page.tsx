import { useState } from "react";
import { Link } from "@tanstack/react-router";

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });

  const canSubmit = form.email.trim().length > 0 && form.password.length > 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 8주차에서 로그인 API 연결
  };

  return (
    <main className="flex justify-center bg-gray-50 px-4 py-32">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-[430px] flex-col gap-4"
      >
        <h1 className="text-2xl font-bold">로그인</h1>

        {/* 이메일 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-semibold">
            이메일
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 focus-within:border-blue-600">
            <MailIcon />
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="flex-1 py-3 text-sm outline-none"
            />
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-semibold">
            비밀번호
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 focus-within:border-blue-600">
            <LockIcon />
            <input
              id="password"
              type="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              className="flex-1 py-3 text-sm outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white disabled:bg-gray-300"
        >
          로그인
        </button>

        <p className="text-center text-xs text-gray-500">
          처음이신가요?{" "}
          <Link to="/signup" className="font-semibold text-blue-600">
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}