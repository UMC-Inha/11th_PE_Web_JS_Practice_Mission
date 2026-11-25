import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/auth-store";
import { useMemberProfile } from "../../hooks/use-member-profile";

export default function Header() {
  const logout = useAuthStore((state) => state.logout);
  const meQuery = useMemberProfile();
  const accessToken = meQuery.token;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  async function handleLogout() {
    logout();
    await queryClient.cancelQueries({ queryKey: ["members", "me"] });
    queryClient.removeQueries({ queryKey: ["members", "me"] });
    await queryClient.cancelQueries({ queryKey: ["favorites"] });
    queryClient.removeQueries({ queryKey: ["favorites"] });
    await navigate({ to: "/login" });
  }
  return (
    <header className="flex items-center justify-between gap-6 border-b border-[#e2e5eb] bg-white px-[5.5%] py-7 max-[600px]:flex-wrap max-[600px]:py-5">
      <div className="flex items-center gap-12 max-[1000px]:gap-6 max-[600px]:flex-wrap max-[600px]:gap-4">
        <Link
          to="/"
          className="flex items-center gap-[10px] text-2xl font-extrabold"
        >
          <img
            src="/icons/movie.svg"
            alt=""
            className="h-9 w-9"
          />
          <span>UMCine</span>
        </Link>

        <nav className="flex items-center gap-8 font-bold text-[#6b7280] max-[1000px]:gap-4">
          <Link
            to="/"
            activeProps={{
              className:
                "text-[#202124] underline underline-offset-4",
            }}
          >
            영화
          </Link>

          <Link
            to="/search"
            activeProps={{
              className:
                "text-[#202124] underline underline-offset-4",
            }}
          >
            검색
          </Link>

          <Link to="/me" activeProps={{ className: "text-[#202124] underline underline-offset-4" }}>내 정보</Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/search"
          search={{}}
          className="grid h-12 w-12 place-items-center rounded-lg border border-[#e2e5eb] bg-white"
          aria-label="검색"
        >
          <img
            src="/icons/search.svg"
            alt=""
            className="h-6 w-6"
          />
        </Link>

        {!accessToken ? (
          <Link to="/login" className="inline-flex h-12 items-center rounded-lg bg-blue-600 px-5 font-bold text-white">로그인</Link>
        ) : meQuery.isLoading ? (
          <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
        ) : (
          <>
            <Link to="/me" className="inline-flex h-11 items-center justify-center rounded-lg border border-blue-700 bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700">마이페이지</Link>
            <button type="button" onClick={handleLogout} className="h-12 rounded-lg border border-[#e2e5eb] bg-white px-4 text-sm font-bold">로그아웃</button>
          </>
        )}
      </div>
    </header>
  );
}
