import { useState, type ChangeEvent } from "react";

export function MyEditPage() {
  const [nickname, setNickname] = useState("윤샘");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const email = "name@example.com";

  const isNicknameValid =
    nickname.trim().length >= 2 && nickname.trim().length <= 12;

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setImageError("5MB 이하의 이미지 파일을 선택해 주세요.");
      event.currentTarget.value = "";
      return;
    }

    setImageError("");

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
      }
    };

    reader.onerror = () => {
      setImageError("이미지를 읽지 못했어요. 다시 선택해 주세요.");
    };

    reader.readAsDataURL(file);
  }

  return (
    <main className="flex flex-1 bg-[#f6f7f9] px-5 py-6">
      <form
        className="mx-auto flex w-full max-w-7xl flex-1 flex-col"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-bold">내 정보 수정</h1>

            <p className="mt-2 text-sm text-[#667085]">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>

          <button
            type="submit"
            disabled={!isNicknameValid}
            className="h-10 shrink-0 rounded-lg bg-[#2563eb] px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            변경사항 저장
          </button>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="flex flex-col items-center pt-4">
            <label
              htmlFor="profile-image"
              className="relative cursor-pointer rounded-full focus-within:ring-2 focus-within:ring-blue-600"
            >
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                aria-label="프로필 이미지 선택"
                onChange={handleImageChange}
                className="sr-only"
              />

              <div className="grid size-20 place-items-center overflow-hidden rounded-full bg-[#e5e7eb]">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="선택한 프로필"
                    className="size-full object-cover"
                  />
                ) : (
                  <img
                    src="/icons/person.svg"
                    alt="기본 프로필"
                    className="scale-200"
                  />
                )}
              </div>

              <img
                src="/icons/edit.svg"
                alt=""
                className="absolute right-0 bottom-0"
              />
            </label>

            <p className="mt-3 text-sm font-bold">프로필 이미지</p>

            <p className="mt-1 text-xs text-[#98a2b3]">선택 사항 · 최대 5MB</p>
            {imageError && (
              <p role="alert" className="mt-2 text-xs text-red-600">
                {imageError}
              </p>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="edit-nickname"
                className="mb-2 block text-xs font-bold"
              >
                닉네임
              </label>

              <div className="flex h-12 items-center rounded-lg border border-[#dfe3ea] bg-white px-4">
                <input
                  id="edit-nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                />

                <button
                  type="button"
                  className="ml-3 shrink-0 text-xs font-semibold text-blue-600"
                >
                  중복 확인
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="edit-email"
                className="mb-2 block text-xs font-bold"
              >
                이메일
              </label>

              <input
                id="edit-email"
                type="email"
                value={email}
                readOnly
                className="h-12 w-full rounded-lg border border-[#dfe3ea] bg-white px-4 text-sm outline-none"
              />
            </div>
          </div>
        </div>
        <section className="mt-auto pt-12" aria-labelledby="withdrawal-heading">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-red-300 bg-red-50 p-5">
            <h2
              id="withdrawal-heading"
              className="text-sm font-bold text-red-600"
            >
              회원 탈퇴
            </h2>

            <button
              type="button"
              className="shrink-0 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600"
            >
              회원 탈퇴
            </button>
          </div>
        </section>
      </form>
    </main>
  );
}
