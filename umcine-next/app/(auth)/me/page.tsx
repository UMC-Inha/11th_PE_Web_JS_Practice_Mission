import type { Metadata } from "next";
import Link from "next/link";
import { MyInfoContent } from "@/app/components/me/my-info-content";

export const metadata: Metadata = {
  title: "내 정보",
  description: "내 프로필과 즐겨찾기한 영화를 확인하세요.",
};

export default function MyInfoPage() {
  return (
    <main className="flex flex-1 flex-col bg-gray-100 p-4 text-left sm:p-8">
      <div className="flex items-center gap-2">
        <Link
          href="/me/ratings"
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 no-underline"
        >
          내 평점
        </Link>
        <Link
          href="/me/edit"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white no-underline"
        >
          정보 수정
        </Link>
      </div>

      {/* 프로필, 즐겨찾기 목록처럼 데이터를 불러오는 부분만 Client Component */}
      <MyInfoContent />
    </main>
  );
}
