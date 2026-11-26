import type { Metadata } from "next";
import Link from "next/link";
import { GuestGuard } from "@/app/components/auth/guest-guard";
import { LoginForm } from "@/app/components/auth/login-form";

export const metadata: Metadata = {
  title: "로그인",
  description: "UMCine에 로그인하세요.",
};

export default function LoginPage() {
  return (
    <GuestGuard>
      <main className="flex flex-1 flex-col items-center justify-center bg-gray-100 px-4 py-10">
        <div className="w-full max-w-[430px] text-left">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">로그인</h1>

          {/* 입력 상태와 제출 처리가 필요한 폼만 Client Component */}
          <LoginForm />

          <p className="mt-5 text-center text-sm text-gray-500">
            처음이신가요?{" "}
            <Link href="/signup" className="font-semibold text-blue-600 no-underline">
              회원가입
            </Link>
          </p>
        </div>
      </main>
    </GuestGuard>
  );
}
