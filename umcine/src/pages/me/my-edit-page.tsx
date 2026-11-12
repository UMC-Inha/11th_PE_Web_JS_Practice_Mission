import { useState } from "react";

// 8주차에서 GET /members/me 응답으로 교체
const MOCK_ME = {
  nickname: "영화광",
  email: "movie@umc.com",
};

export function MyEditPage() {
  const [nickname, setNickname] = useState(MOCK_ME.nickname);

  const isNicknameValid =
    nickname.trim().length >= 2 && nickname.trim().length <= 12;
  const showNicknameError = nickname.length > 0 && !isNicknameValid;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 8주차에서 PATCH /members/me 연결
  };

  return (
    <main className="bg-gray-50">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-[1280px] flex-col px-6 py-8"
      >
        {/* 제목 + 저장 버튼 */}
        <div className="flex items-start justify-between pb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold">내 정보 수정</h1>
            <p className="text-sm text-gray-500">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>
          <button
            type="submit"
            disabled={!isNicknameValid}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-gray-300"
          >
            변경사항 저장
          </button>
        </div>

        {/* 프로필 이미지 + 입력 폼 */}
        <div className="flex gap-11">
          {/* 왼쪽: 프로필 이미지 */}
          <div className="flex w-1/2 flex-col items-center gap-2">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
              </div>
              <button
                type="button"
                aria-label="프로필 이미지 변경"
                className="absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
                </svg>
              </button>
            </div>
            <p className="text-sm font-semibold">프로필 이미지</p>
            <p className="text-xs text-gray-400">선택 사항 · 최대 5MB</p>
          </div>

          {/* 오른쪽: 닉네임, 이메일 */}
          <div className="flex w-1/2 flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="nickname" className="text-sm font-semibold">
                닉네임
              </label>
              <div className="flex items-center rounded-lg border border-gray-200 bg-white px-3 focus-within:border-blue-600">
                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="flex-1 py-3 text-sm outline-none"
                />
                <button
                  type="button"
                  disabled={!isNicknameValid}
                  className="shrink-0 text-xs font-semibold text-blue-600 disabled:text-gray-300"
                >
                  중복 확인
                </button>
              </div>
              {showNicknameError && (
                <p className="text-xs text-red-500">
                  닉네임은 2자 이상 12자 이하로 입력해 주세요.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={MOCK_ME.email}
                readOnly
                className="rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none"
              />
            </div>
          </div>
        </div>

        {/* 회원 탈퇴 */}
        <div className="mt-auto flex items-center justify-between rounded-lg border border-red-300 bg-red-50 px-5 py-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-red-600">회원 탈퇴</p>
            <p className="text-xs text-red-500">
              탈퇴하면 작성한 평점, 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-red-400 bg-white px-4 py-2 text-sm font-semibold text-red-600"
          >
            회원 탈퇴
          </button>
        </div>
      </form>
    </main>
  );
}