import { Link } from "@tanstack/react-router";

const CONTAINER_CLASS = "mx-auto w-[min(1080px,100%_-_48px)]";

const HEADER_BUTTON_CLASS =
  "flex h-[34px] shrink-0 cursor-pointer items-center rounded-md bg-[#2563EB] px-3.5 text-[13px] font-bold text-white hover:brightness-95";

const PROFILE = {
  nickname: "gs0428",
  email: "gwangsoo@cinemalab.kr",
};

const FAVORITE_MOVIES = [
  {
    id: 1,
    title: "스파이더맨: 브랜드 뉴 데이",
    releaseDate: "2026.07.29",
    posterPath: "",
  },
  { id: 2, title: "오디세이", releaseDate: "2026.08.05", posterPath: "" },
  {
    id: 3,
    title: "미니언즈 & 몬스터즈",
    releaseDate: "2026.07.15",
    posterPath: "",
  },
];

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-9 w-9">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6z" />
    </svg>
  );
}

export function MyPage() {
  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#F5F6F8] py-6">
      <div className={CONTAINER_CLASS}>
        {/* 제목 + 정보 수정 버튼 */}
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-bold leading-10 text-[#17191E]">
            내 정보
          </h1>
          <Link to="/my/edit" className={HEADER_BUTTON_CLASS}>
            정보 수정
          </Link>
        </div>

        {/* 기본 정보 */}
        <section className="mt-7 border-y border-[#E3E6EB] py-4">
          <h2 className="text-sm font-bold leading-5 text-[#17191E]">
            기본 정보
          </h2>

          <div className="mt-3 flex items-center">
            <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[#E3E6EB] text-[#17191E]">
              <PersonIcon />
            </div>

            <div className="ml-[30px] grid flex-1 grid-cols-3">
              <div className="flex flex-col gap-1">
                <p className="text-xs leading-4 text-[#969DA8]">닉네임</p>
                <p className="text-sm font-bold text-[#17191E]">
                  {PROFILE.nickname}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs leading-4 text-[#969DA8]">이메일</p>
                <p className="text-sm font-bold text-[#17191E]">
                  {PROFILE.email}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 내 즐겨찾기 */}
        <section className="mt-7">
          <h2 className="text-sm font-bold leading-5 text-[#17191E]">
            내 즐겨찾기
          </h2>

          <ul className="mt-3 grid grid-cols-5 gap-[18px]">
            {FAVORITE_MOVIES.map((movie) => (
              <li key={movie.id} className="flex flex-col gap-2">
                <div className="aspect-[241.6/274] w-full overflow-hidden rounded-[10px] bg-[#E3E6EB]">
                  {movie.posterPath && (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                      alt={`${movie.title} 포스터`}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <p className="text-sm font-bold text-[#17191E]">{movie.title}</p>
                <p className="-mt-1 text-xs text-[#969DA8]">
                  {movie.releaseDate}
                </p>
              </li>
            ))}
          </ul>

          {/* 페이지네이션 */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled
              className="flex h-10 w-10 items-center justify-center text-[#969DA8] disabled:opacity-40"
            >
              ‹
            </button>
            <button
              type="button"
              className="h-10 w-10 rounded-lg bg-[#17191E] text-sm font-bold text-white"
            >
              1
            </button>
            <button
              type="button"
              disabled
              className="flex h-10 w-10 items-center justify-center text-[#969DA8] disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}