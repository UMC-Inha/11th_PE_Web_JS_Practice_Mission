import { useState } from "react";
import { checkEmail, checkNickname } from "../../api/members/check-member";
import { getMemberRatings } from "../../api/members/get-member-ratings";
import type { RatingResponse } from "../../api/members/models";

const sectionClass = "rounded-lg border border-[#e5e7eb] bg-white p-5";
const labelClass = "mb-2 block text-[13px] font-bold";
const inputClass =
  "h-9 w-full rounded-md border border-[#e5e7eb] px-3 text-[13px] outline-none";
const buttonClass =
  "h-9 shrink-0 cursor-pointer rounded-md bg-[#2563EB] px-4 text-xs font-bold text-white disabled:opacity-40";

export function MyPage() {
  // 닉네임 중복 체크
  const [nickname, setNickname] = useState("수현");
  const [nicknameResult, setNicknameResult] = useState<string | null>(null);
  const [isNicknameLoading, setIsNicknameLoading] = useState(false);

  // 이메일 중복 체크
  const [email, setEmail] = useState("noco@umc.com");
  const [emailResult, setEmailResult] = useState<string | null>(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  // 유저별 평점 조회
  const [memberId, setMemberId] = useState("1");
  const [ratings, setRatings] = useState<RatingResponse[] | null>(null);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [isRatingLoading, setIsRatingLoading] = useState(false);

  async function handleCheckNickname() {
    setIsNicknameLoading(true);
    setNicknameResult(null);

    try {
      const response = await checkNickname(nickname);
      setNicknameResult(
        response.available
          ? "사용할 수 있는 닉네임이에요."
          : "이미 사용 중인 닉네임이에요.",
      );
    } catch {
      setNicknameResult("닉네임을 확인하지 못했어요.");
    } finally {
      setIsNicknameLoading(false);
    }
  }

  async function handleCheckEmail() {
    setIsEmailLoading(true);
    setEmailResult(null);

    try {
      const response = await checkEmail(email);
      setEmailResult(
        response.available
          ? "사용할 수 있는 이메일이에요."
          : "이미 가입된 이메일이에요.",
      );
    } catch {
      setEmailResult("이메일을 확인하지 못했어요.");
    } finally {
      setIsEmailLoading(false);
    }
  }

  async function handleGetRatings() {
    setIsRatingLoading(true);
    setRatings(null);
    setRatingError(null);

    try {
      const response = await getMemberRatings(Number(memberId));
      setRatings(response);
    } catch {
      setRatingError("평점을 불러오지 못했어요. 존재하는 회원인지 확인해 주세요.");
    } finally {
      setIsRatingLoading(false);
    }
  }

  return (
    <main className="mx-auto w-[min(1080px,100%_-_48px)] pt-6 pb-[60px]">
      <h1 className="mb-6 text-[30px] font-extrabold">내 정보</h1>

      <div className="flex flex-col gap-4">
        {/* 닉네임 중복 체크 */}
        <section className={sectionClass}>
          <h2 className="mb-1 text-[15px] font-bold">닉네임 중복 체크</h2>
          <p className="mb-4 text-[11px] text-[#9ca3af]">
            GET /members/nickname/&#123;nickname&#125;
          </p>

          <label className={labelClass} htmlFor="nickname">
            닉네임
          </label>
          <div className="flex gap-2">
            <input
              id="nickname"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              className={inputClass}
            />
            <button
              type="button"
              onClick={handleCheckNickname}
              disabled={isNicknameLoading || nickname.trim() === ""}
              className={buttonClass}
            >
              {isNicknameLoading ? "확인 중" : "중복 확인"}
            </button>
          </div>

          {nicknameResult && (
            <p className="mt-3 text-xs text-[#555]">{nicknameResult}</p>
          )}
        </section>

        {/* 이메일 중복 체크 */}
        <section className={sectionClass}>
          <h2 className="mb-1 text-[15px] font-bold">이메일 중복 체크</h2>
          <p className="mb-4 text-[11px] text-[#9ca3af]">
            GET /members/email/&#123;email&#125;
          </p>

          <label className={labelClass} htmlFor="email">
            이메일
          </label>
          <div className="flex gap-2">
            <input
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
            />
            <button
              type="button"
              onClick={handleCheckEmail}
              disabled={isEmailLoading || email.trim() === ""}
              className={buttonClass}
            >
              {isEmailLoading ? "확인 중" : "중복 확인"}
            </button>
          </div>

          {emailResult && (
            <p className="mt-3 text-xs text-[#555]">{emailResult}</p>
          )}
        </section>

        {/* 유저별 평점 조회 */}
        <section className={sectionClass}>
          <h2 className="mb-1 text-[15px] font-bold">내가 남긴 평점</h2>
          <p className="mb-4 text-[11px] text-[#9ca3af]">
            GET /members/&#123;memberId&#125;/ratings
          </p>

          <label className={labelClass} htmlFor="memberId">
            회원 번호
          </label>
          <div className="flex gap-2">
            <input
              id="memberId"
              type="number"
              value={memberId}
              onChange={(event) => setMemberId(event.target.value)}
              className={inputClass}
            />
            <button
              type="button"
              onClick={handleGetRatings}
              disabled={isRatingLoading || memberId.trim() === ""}
              className={buttonClass}
            >
              {isRatingLoading ? "불러오는 중" : "평점 조회"}
            </button>
          </div>

          {isRatingLoading ? (
            <p className="mt-4 text-xs text-[#888]">평점을 불러오는 중이에요.</p>
          ) : ratingError ? (
            <p className="mt-4 text-xs text-[#888]">{ratingError}</p>
          ) : ratings === null ? null : ratings.length === 0 ? (
            <p className="mt-4 text-xs text-[#888]">아직 남긴 평점이 없어요.</p>
          ) : (
            <ul className="mt-4 flex flex-col gap-2">
              {ratings.map((rating) => (
                <li
                  key={rating.ratingId}
                  className="rounded-md border border-[#e5e7eb] px-4 py-3"
                >
                  <p className="text-[13px] font-bold">
                    영화 #{rating.movieId}
                    <span className="ml-2 text-[#2563EB]">
                      ★ {rating.score}
                    </span>
                  </p>
                  {rating.comment && (
                    <p className="mt-1 text-xs text-[#555]">{rating.comment}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}