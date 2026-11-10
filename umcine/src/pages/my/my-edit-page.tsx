import { useState } from "react";
import { PencilIcon, UserIcon } from "../../components/icons";
import { DUMMY_MY_INFO } from "../../data/my-info";

export function MyEditPage() {
  const [nickname, setNickname] = useState(DUMMY_MY_INFO.nickname);

  const trimmedNickname = nickname.trim();
  const isNicknameValid = trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
  const isNicknameChanged = trimmedNickname !== DUMMY_MY_INFO.nickname;

  // 형식이 맞고, 원래 닉네임과 다를 때만 저장 가능
  const canSave = isNicknameValid && isNicknameChanged;

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSave) return;
  };

  const inputClass =
    "h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#4f5de8]";
  const labelClass = "mb-2 block text-xs font-semibold";

  return (
    <main className="mx-auto flex w-full max-w-360 flex-1 flex-col px-20 py-12">
      <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[32px] font-bold">내 정보 수정</h1>
            <p className="mt-1 text-sm text-gray-500">닉네임과 프로필 이미지만 변경할 수 있어요.</p>
          </div>
          <button
            type="submit"
            disabled={!canSave}
            className="rounded-lg bg-[#4f5de8] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            변경사항 저장
          </button>
        </div>

        <div className="mt-12 mb-16 grid grid-cols-2 gap-12">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-gray-800">
                <UserIcon className="h-8 w-8" />
              </div>
              <button
                type="button"
                aria-label="프로필 이미지 변경"
                className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-white text-gray-900 shadow"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-sm font-semibold">프로필 이미지</p>
            <p className="text-xs text-gray-400">선택 사항 · 최대 5MB</p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="nickname" className={labelClass}>닉네임</label>
              <div className="relative">
                <input
                  id="nickname"
                  type="text"
                  className={`${inputClass} pr-20`}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
                <button
                  type="button"
                  disabled={!isNicknameValid || !isNicknameChanged}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#4f5de8] disabled:text-gray-300"
                >
                  중복 확인
                </button>
              </div>
              {!isNicknameValid && (
                <p className="mt-1 text-xs text-red-500">닉네임은 2~12자로 입력해 주세요.</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>이메일</label>
              <input
                id="email"
                type="email"
                className={`${inputClass} text-gray-500`}
                value={DUMMY_MY_INFO.email}
                readOnly
              />
            </div>
          </div>
        </div>

        <section className="mt-auto flex items-center justify-between rounded-lg border border-red-300 bg-red-50 px-6 py-5">
          <div>
            <p className="text-sm font-bold text-red-600">회원 탈퇴</p>
            <p className="mt-1 text-xs text-red-500">
              탈퇴하면 작성한 평점, 후기와 북마크가 모두 사라지며 복구할 수 없습니다.
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600"
          >
            회원 탈퇴
          </button>
        </section>
      </form>
    </main>
  );
}