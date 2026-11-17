import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getMyInfo, myInfoQueryKey } from "../../api/auth-member";
import type { MemberInfo } from "../../api/auth-member";
import { useAuthStore } from "../../stores/auth-store";
import type { AuthSession } from "../../stores/auth-store";

interface Props {
  children: (
    profile: MemberInfo,
    session: AuthSession,
  ) => ReactNode;
}

export function MemberProfile({ children }: Props) {
  const { session, message } = useAuthStore();

  const query = useQuery({
    queryKey: myInfoQueryKey(session?.id),
    queryFn: ({ signal }) => {
      if (!session) {
        throw new Error("로그인이 필요해요.");
      }

      return getMyInfo(session, signal);
    },
    enabled: !!session,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });

  if (!session) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-20">
        <p role="status">
          {message || "내 정보를 보려면 로그인해 주세요."}
        </p>

        <Link
          to="/login"
          className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white"
        >
          로그인하기
        </Link>
      </main>
    );
  }

  if (query.isPending) {
    return (
      <main
        role="status"
        className="flex-1 px-5 py-16 text-center"
      >
        회원 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (query.isError) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-20">
        <p role="alert">{query.error.message}</p>

        <button
          type="button"
          onClick={() => void query.refetch()}
          disabled={query.isFetching}
          className="rounded-lg border border-gray-300 bg-white px-5 py-3 disabled:opacity-50"
        >
          다시 시도
        </button>
      </main>
    );
  }

  return children(query.data, session);
}