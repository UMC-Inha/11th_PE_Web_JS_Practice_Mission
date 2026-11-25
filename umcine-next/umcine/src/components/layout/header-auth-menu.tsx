"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import { useAuthStore } from "@/stores/auth-store";

// 로그인 상태(localStorage)를 읽어야 해서 Client Component
export function HeaderAuthMenu() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = Boolean(accessToken);

  // 로그인했을 때만 내 정보를 불러와 닉네임 표시
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const handleLogout = () => {
    logout();
    // 이전 계정의 정보가 남지 않도록 캐시 삭제
    queryClient.removeQueries({ queryKey: ["members", "me"] });
    router.push("/");
  };

  // 로그인 정보를 불러오기 전에는 로그인 버튼이 깜빡이지 않도록 비워 둠
  if (!hasHydrated) return null;

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="flex h-[42px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[#2563EB] px-4 text-sm leading-[17px] font-extrabold text-white"
      >
        로그인
      </Link>
    );
  }

  return (
    <>
      <span className="text-sm leading-[17px] font-bold text-[#17191E]">
        {meQuery.data ? `${meQuery.data.nickname}님` : ""}
      </span>
      <button
        type="button"
        onClick={handleLogout}
        className="flex h-[42px] cursor-pointer items-center justify-center rounded-lg border border-[#E3E6EB] bg-white px-4 text-sm leading-[17px] font-extrabold text-[#606774]"
      >
        로그아웃
      </button>
    </>
  );
}
