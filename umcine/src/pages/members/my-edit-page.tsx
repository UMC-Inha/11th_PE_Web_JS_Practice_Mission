import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useProfileStore } from "../../stores/profile-store";

export function MyEditPage() {
  const savedNickname = useProfileStore((state) => state.nickname);
  const email = useProfileStore((state) => state.email);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const navigate = useNavigate();

  const [nickname, setNickname] = useState(savedNickname);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (nickname.trim().length < 2 || nickname.trim().length > 12) {
      alert("닉네임은 2~12자로 입력해 주세요.");
      return;
    }

    updateProfile(nickname.trim());
    alert("변경사항을 저장했어요.");
    navigate({ to: "/me" });
  }

  return (
    <main className="mx-auto w-full max-w-[920px] px-5 py-10 sm:px-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#17191e]">
            내 정보 수정
          </h1>
          <p className="mt-2 text-sm text-[#606774]">
            닉네임과 프로필 이미지만 변경할 수 있어요.
          </p>
        </div>

        <button
          type="submit"
          form="profile-edit-form"
          className="rounded-md bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white"
        >
          변경사항 저장
        </button>
      </div>

      <form
        id="profile-edit-form"
        onSubmit={handleSubmit}
        className="mt-10 grid gap-10 sm:grid-cols-[180px_1fr]"
      >
        <div className="flex flex-col items-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-[#e3e6eb] text-3xl">
            👤
          </div>
          <p className="mt-3 text-sm font-semibold">프로필 이미지</p>
          <p className="mt-1 text-xs text-[#969da8]">선택 사항 · 최대 5MB</p>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <label
              htmlFor="nickname"
              className="mb-2 block text-sm font-semibold"
            >
              닉네임
            </label>

            <div className="relative">
              <input
                id="nickname"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                className="h-12 w-full rounded-lg border border-[#d9dde5] bg-white px-3 pr-24 text-sm outline-none focus:border-[#2563eb]"
              />
              <button
                type="button"
                onClick={() => alert("사용 가능한 닉네임인지 확인했어요.")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#2563eb]"
              >
                중복 확인
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold"
            >
              이메일
            </label>
            <input
              id="email"
              value={email}
              readOnly
              className="h-12 w-full rounded-lg border border-[#d9dde5] bg-[#f6f7f9] px-3 text-sm text-[#606774]"
            />
          </div>
        </div>
      </form>

      <section className="mt-28 rounded-lg border border-[#f87171] bg-[#fff7f7] p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#dc2626]">회원 탈퇴</h2>
            <p className="mt-1 text-xs text-[#dc2626]">
              탈퇴하면 작성한 평점과 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
            </p>
          </div>

          <button
            type="button"
            onClick={() => alert("회원 탈퇴 기능은 이후 API 연동 단계에서 구현해요.")}
            className="rounded-md border border-[#f87171] bg-white px-4 py-2 text-sm font-semibold text-[#dc2626]"
          >
            회원 탈퇴
          </button>
        </div>
      </section>
    </main>
  );
}