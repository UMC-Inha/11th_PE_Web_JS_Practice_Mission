import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getMyInfo, myInfoQueryKey } from "../../api/auth-member";
import type { MemberInfo } from "../../api/auth-member";
import { useAuthStore } from "../../stores/auth-store";

interface Props {
  children: (profile: MemberInfo, accessToken: string) => ReactNode;
}

export function MemberProfile({ children }: Props) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const query = useQuery({
    queryKey: myInfoQueryKey,
    queryFn: ({ signal }) => {
      if (!accessToken) {
        throw new Error("로그인이 필요해요.");
      }

      return getMyInfo(accessToken, signal);
    },
    enabled: Boolean(accessToken),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  if (!accessToken) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-20">
        <p role="status">내 정보를 보려면 로그인해 주세요.</p>

        <Link
          to="/login"
          className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white"
        >
          로그인하기
        </Link>
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

  if (query.isLoading || !query.data) {
    return (
      <main role="status" className="flex-1 px-5 py-16 text-center">
        회원 정보를 불러오는 중이에요.
      </main>
    );
  }

  return children(query.data, accessToken);
}