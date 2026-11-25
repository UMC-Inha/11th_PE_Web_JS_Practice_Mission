import { Link } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

export function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <header className="border-b border-[#e3e6eb] bg-white">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-10">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2 text-lg font-extrabold text-[#17191e]">
            <img className="h-[22px] w-[22px]" src="/icons/movie.svg" alt="" />
            <span>UMCine</span>
          </Link>

          <nav className="flex items-center gap-7 text-sm text-[#606774]">
            <Link to="/" activeProps={{ className: 'font-bold text-[#2563eb]' }}>
              영화
            </Link>
            <Link to="/search" activeProps={{ className: 'font-bold text-[#2563eb]' }}>
              검색
            </Link>
            <Link to="/me" activeProps={{ className: "font-bold text-[#2563eb]" }}>
              내 정보
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/search"
            className="grid h-9 w-9 place-items-center rounded-md border border-[#e3e6eb] bg-white"
            aria-label="검색"
          >
            <img className="h-[19px] w-[19px]" src="/icons/search.svg" alt="" />
          </Link>

          {!accessToken ? (
            <Link to="/login">로그인</Link>
          ) : meQuery.isLoading ? (
            <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <Link to="/my">마이페이지</Link>
          )}
        </div>
      </div>
    </header>
  )
}
