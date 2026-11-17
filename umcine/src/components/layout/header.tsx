import {
  Link,
  useRouterState,
  useNavigate,
} from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

export default function Header() {
  const { session, signOut } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const isMovieRoute =
    pathname === "/" ||
    pathname.startsWith("/movies/");

  const isSearchRoute =
    pathname.startsWith("/search");

  const isMyPageRoute =
    pathname.startsWith("/mypage");

  const handleLogout = async () => {
    signOut();

    await queryClient.cancelQueries({
      queryKey: ["member"],
    });

    queryClient.removeQueries({
      queryKey: ["member"],
    });

    await navigate({
      to: "/login",
    });
  };

  return (
    <header className="h-[91px] w-full shrink-0 border-b border-gray-200 bg-white">
      <div className="flex h-full w-full items-center justify-between px-5 py-6 xl:px-20">
        <div className="flex h-full items-center">
          <Link
            to="/"
            className="flex items-center gap-3 text-[22px] font-extrabold tracking-tight"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#191B20]">
              <img
                src="/icons/movie.svg"
                alt=""
                className="h-6 w-6"
              />
            </span>

            UMCine
          </Link>

          <nav
            className="ml-10 flex items-center gap-8 text-sm font-semibold text-gray-500"
            aria-label="주 메뉴"
          >
            <Link
              to="/"
              className={cn(
                "underline-offset-4",
                isMovieRoute &&
                  "font-bold text-[#191B20] underline",
              )}
            >
              영화
            </Link>

            <Link
              to="/search"
              className={cn(
                "underline-offset-4",
                isSearchRoute &&
                  "font-bold text-[#191B20] underline",
              )}
            >
              검색
            </Link>

            <Link
              to="/mypage"
              className={cn(
                "underline-offset-4",
                isMyPageRoute &&
                  "font-bold text-[#191B20] underline",
              )}
            >
              내 정보
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/search"
            aria-label="검색"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-white"
          >
            <img
              src="/icons/search.svg"
              alt=""
              className="h-6 w-6 opacity-60"
            />
          </Link>

          {session ? (
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="h-11 cursor-pointer rounded-lg bg-blue-600 px-5 text-sm! font-bold! text-white"
            >
              로그아웃
            </button>
          ) : (
            <Link
              to="/login"
              className="flex h-11 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-bold text-white"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}