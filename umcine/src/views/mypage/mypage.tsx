"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import FavoriteMovieList from "../../components/mypage/favorite-movie-list";
import { meQueryOptions } from "../../queries/member-queries";
import { useAuthStore } from "../../stores/auth-store";

export function MyPage() {
  const isLoggedIn = useAuthStore((state) => state.accessToken !== null);
  const { data: me, isPending, isError } = useQuery(meQueryOptions(isLoggedIn));

  if (!isLoggedIn) {
    return (
      <main className="mx-auto w-full max-w-[1126px] flex-1 px-6 py-8">
        <p className="text-sm text-app-text">
          로그인이 필요해요.{" "}
          <Link href="/login" className="font-bold text-app-accent no-underline">
            로그인하러 가기
          </Link>
        </p>
      </main>
    );
  }

  if (isPending) {
    return (
      <main className="mx-auto w-full max-w-[1126px] flex-1 px-6 py-8">
        <p role="status" className="text-sm text-app-text">
          내 정보를 불러오는 중이에요.
        </p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto w-full max-w-[1126px] flex-1 px-6 py-8">
        <p role="alert" className="text-sm text-app-text">
          내 정보를 불러오지 못했어요. 다시 로그인해 주세요.{" "}
          <Link href="/login" className="font-bold text-app-accent no-underline">
            로그인
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1126px] flex-1 px-6 py-6 pb-16">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-extrabold text-app-text-h">내 정보</h1>
        <Link
          href="/mypage/edit"
          className="flex h-9 items-center rounded-lg bg-app-accent px-4 text-sm font-bold text-white no-underline"
        >
          정보 수정
        </Link>
      </div>

      <section className="mt-5 border-t border-app-border pt-4">
        <h2 className="text-base font-bold text-app-text-h">기본 정보</h2>
        <div className="mt-4 flex items-center gap-8 border-b border-app-border pb-5">
          <div className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-full bg-app-surface">
            <img
              className="h-9 w-9"
              src="/icons/person.svg"
              alt="프로필 이미지"
            />
          </div>
          <dl className="m-0 grid flex-1 grid-cols-2 gap-6">
            <div>
              <dt className="text-[11px] text-gray-400">닉네임</dt>
              <dd className="m-0 mt-1 text-[15px] font-bold text-app-text-h">
                {me.nickname}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-gray-400">이메일</dt>
              <dd className="m-0 mt-1 text-[15px] font-bold text-app-text-h">
                {me.email}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-base font-bold text-app-text-h">내 즐겨찾기</h2>
        <FavoriteMovieList />
      </section>
    </main>
  );
}
