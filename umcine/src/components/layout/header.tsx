import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/auth-store";

export default function Header() {
  const { accessToken, nickname, logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  async function handleLogout() {
    logout();
    await queryClient.cancelQueries({ queryKey: ["member"] });
    queryClient.removeQueries({ queryKey: ["member"] });
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

        {accessToken ? <>
          <Link to="/me" className="max-w-32 truncate text-sm font-bold">{nickname}님</Link>
          <button type="button" onClick={handleLogout} className="h-12 rounded-lg border border-[#e2e5eb] bg-white px-4 text-sm font-bold">로그아웃</button>
        </> : <Link to="/login" className="inline-flex h-12 items-center rounded-lg bg-blue-600 px-5 font-bold text-white">로그인</Link>}
      </div>
    </header>
  );
}
