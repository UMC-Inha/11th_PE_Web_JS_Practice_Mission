import { useState } from "react";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { Link } from "@tanstack/react-router";

export function EditPage() {
  const [nickname, setNickname] = useState("gs0428");
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);

  const email = "gwangsoo@cinemalab.kr";

  const handleCheckNickname = async () => {
    try {
      const response = await checkNicknameDuplicate(nickname);
      setIsNicknameAvailable(response.available);
    } catch {
      alert("닉네임 중복 확인에 실패했습니다.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-91px)] flex-col bg-[#F6F7F9] px-5 py-6 md:px-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#17191E]">
            내 정보 수정
          </h1>
          <p className="mt-2 text-sm text-[#606774]">
            닉네임과 프로필 이미지만 변경할 수 있어요.
          </p>
        </div>

        <Link
          to="/mypage"
          className="flex h-10 items-center justify-center rounded-lg bg-[#2563EB] px-4 text-sm font-extrabold text-white"
        >
          변경사항 저장
        </Link>
      </div>

      <div className="mt-8 flex flex-col items-center gap-11 md:flex-row">
        <div className="flex w-full flex-col items-center gap-1 md:w-[360px]">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E3E6EB]">
              <img
                src="/icons/person.svg"
                alt="프로필 이미지"
                className="h-12 w-12"
              />
            </div>

            <button
              type="button"
              className="absolute -right-1 bottom-0 h-6 w-6 cursor-pointer rounded-full"
              aria-label="프로필 이미지 수정"
            >
              <img
                src="/icons/edit.svg"
                alt=""
                className="h-full w-full"
              />
            </button>
          </div>

          <p className="text-base font-bold text-[#17191E]">
            프로필 이미지
          </p>
          <p className="text-xs text-[#969DA8]">
            선택 사항 · 최대 5MB
          </p>
        </div>

        <div className="flex w-full flex-1 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="nickname"
              className="text-xs font-extrabold text-[#17191E]"
            >
              닉네임
            </label>

            <div className="flex h-12 items-center rounded-lg border border-[#E3E6EB] bg-white px-3">
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setIsNicknameAvailable(null);
                }}
                className="min-w-0 flex-1 text-sm outline-none"
              />

              <button
                type="button"
                onClick={handleCheckNickname}
                className="text-xs font-extrabold text-[#2563EB]"
              >
                중복 확인
              </button>
            </div>

            {isNicknameAvailable === true && (
              <p className="text-xs text-[#2563EB]">
                사용 가능한 닉네임입니다.
              </p>
            )}

            {isNicknameAvailable === false && (
              <p className="text-xs text-red-600">
                이미 사용 중인 닉네임입니다.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-xs font-extrabold text-[#17191E]"
            >
              이메일
            </label>

            <input
              id="email"
              type="email"
              value={email}
              readOnly
              className="h-12 rounded-lg border border-[#E3E6EB] bg-white px-3 text-sm text-[#17191E] outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-auto pt-16">
        <div className="flex items-center justify-between gap-4 rounded-[10px] border border-red-600 bg-red-600/10 p-5">
          <div>
            <h2 className="text-sm font-bold text-red-600">
              회원 탈퇴
            </h2>
            <p className="mt-1 text-xs text-red-600">
              탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
            </p>
          </div>

          <button
            type="button"
            className="h-10 shrink-0 rounded-lg border border-red-600 bg-white px-4 text-sm font-extrabold text-red-600"
          >
            회원 탈퇴
          </button>
        </div>
      </div>
    </div >
  );
}