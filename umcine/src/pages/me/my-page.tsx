import { Link } from "@tanstack/react-router";

// 8주차에서 GET /members/me 응답으로 교체
const MOCK_ME = {
  nickname: "영화광",
  email: "movie@umc.com",
};

// 즐겨찾기 가짜 데이터 (bookmark-store로 교체 가능)
const MOCK_FAVORITES = [
  { id: 1, title: "스파이더맨: 브랜드 뉴 데이", releaseDate: "2026.07.29" },
  { id: 2, title: "오디세이", releaseDate: "2026.08.05" },
  { id: 3, title: "미니언즈 & 몬스터즈", releaseDate: "2026.07.15" },
];

export function MyPage() {
  return (
    <main className="bg-gray-50">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col px-6 py-8">
        {/* 제목 + 정보 수정 버튼 */}
        <div className="flex items-center justify-between pb-6">
          <h1 className="text-3xl font-bold">내 정보</h1>
          <Link
            to="/me/edit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            정보 수정
          </Link>
        </div>

        {/* 기본 정보 */}
        <section className="flex flex-col gap-4 border-y border-gray-200 py-3">
          <h2 className="text-sm font-semibold">기본 정보</h2>
          <div className="flex items-center gap-6">
            <Avatar />
            <div className="grid flex-1 grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">닉네임</span>
                <span className="text-sm font-semibold">{MOCK_ME.nickname}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">이메일</span>
                <span className="text-sm font-semibold">{MOCK_ME.email}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 내 즐겨찾기 */}
        <section className="flex flex-col gap-4 py-6">
          <h2 className="text-sm font-semibold">내 즐겨찾기</h2>
          <ul className="flex flex-wrap gap-4">
            {MOCK_FAVORITES.map((movie) => (
              <li key={movie.id} className="flex w-[180px] flex-col gap-2">
                <div className="aspect-[3/4] w-full rounded-lg bg-gray-200" />
                <p className="text-sm font-semibold">{movie.title}</p>
                <p className="text-xs text-gray-400">{movie.releaseDate}</p>
              </li>
            ))}
          </ul>

          {/* 페이지네이션 */}
          <div className="flex justify-center gap-2 pt-4">
            <button type="button" disabled className="px-2 text-gray-300">‹</button>
            <button type="button" className="h-7 w-7 rounded bg-gray-900 text-xs font-semibold text-white">
              1
            </button>
            <button type="button" disabled className="px-2 text-gray-300">›</button>
          </div>
        </section>
      </div>
    </main>
  );
}

function Avatar() {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
      </svg>
    </div>
  );
}