import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/app/components/auth/signup-form";

export const metadata: Metadata = {
  title: "회원가입",
  description: "UMCine 계정을 만드세요.",
};

export default function SignupPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-[430px] text-left">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">회원가입</h1>

        <SignupForm />

        <p className="mt-5 text-center text-sm text-gray-500">
          이미 계정이 있나요?{" "}
          <Link href="/login" className="font-semibold text-blue-600 no-underline">
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}
