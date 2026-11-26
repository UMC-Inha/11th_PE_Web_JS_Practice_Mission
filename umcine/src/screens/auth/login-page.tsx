"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const loginMutation = useLoginMutation();

  const canSubmit =
    EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  };

  return (
    <main className="flex min-h-[calc(100vh-128px)] items-center justify-center px-5 py-16">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[340px] flex-col gap-5"
      >
        <h1 className="text-[28px] font-bold tracking-tight text-[#17191e]">
          로그인
        </h1>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-[#30343b]"
          >
            이메일
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                email: event.target.value,
              }))
            }
            className="h-12 w-full rounded-lg border border-[#d9dde5] bg-white px-3 text-sm outline-none placeholder:text-[#a8afbb] focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-semibold text-[#30343b]"
          >
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                password: event.target.value,
              }))
            }
            className="h-12 w-full rounded-lg border border-[#d9dde5] bg-white px-3 text-sm outline-none placeholder:text-[#a8afbb] focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit || loginMutation.isPending}
          className="h-12 rounded-lg bg-[#2563eb] text-sm font-semibold text-white disabled:bg-[#9ab7ef]"
        >
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>

        <p className="text-center text-xs text-[#9aa1ad]">
          처음이신가요?{" "}
          <Link href="/signup" className="font-semibold text-[#2563eb]">
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}
