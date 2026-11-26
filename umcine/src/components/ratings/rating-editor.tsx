"use client";

import { useState } from "react";
import type { Rating } from "../../api/ratings/ratings";
import { useRatingMutations } from "../../hooks/use-ratings";

interface RatingEditorProps {
  movieId: number;
  memberId: number | undefined;
  isLoggedIn: boolean;
  existingRating: Rating | undefined;
}

const SCORES = [1, 2, 3, 4, 5];

export function RatingEditor({
  movieId,
  memberId,
  isLoggedIn,
  existingRating,
}: RatingEditorProps) {
  const [score, setScore] = useState(existingRating?.score ?? 0);
  const [comment, setComment] = useState(existingRating?.comment ?? "");
  const { createMutation, updateMutation, deleteMutation } =
    useRatingMutations(memberId);

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const checkCanRequest = () => {
    if (!isLoggedIn) {
      alert("평점은 로그인 후 작성할 수 있어요.");
      return false;
    }

    if (memberId === undefined) {
      alert("회원 정보를 확인하는 중이에요. 잠시 후 다시 시도해 주세요.");
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!checkCanRequest()) return;

    if (score < 1 || score > 5) {
      alert("별점을 1점 이상 선택해 주세요.");
      return;
    }

    if (existingRating) {
      updateMutation.mutate(
        {
          ratingId: existingRating.ratingId,
          score,
          comment: comment.trim(),
        },
        {
          onSuccess: () => alert("평점을 수정했어요."),
          onError: () => alert("평점 수정에 실패했어요."),
        },
      );
      return;
    }

    createMutation.mutate(
      {
        movieId,
        score,
        comment: comment.trim(),
      },
      {
        onSuccess: () => alert("평점을 저장했어요."),
        onError: () => alert("평점 저장에 실패했어요."),
      },
    );
  };

  const handleDelete = () => {
    if (!checkCanRequest() || !existingRating) return;

    deleteMutation.mutate(existingRating.ratingId, {
      onSuccess: () => alert("평점을 삭제했어요."),
      onError: () => alert("평점 삭제에 실패했어요."),
    });
  };

  return (
    <aside className="border-l border-[#e3e6eb] pl-5">
      <h2 className="text-sm font-bold text-[#17191e]">내 평점</h2>

      <div className="mt-2 flex gap-1" aria-label={`선택한 평점 ${score}점`}>
        {SCORES.map((value) => (
          <button
            key={value}
            className={`text-2xl leading-none ${
              value <= score ? "text-[#f59e0b]" : "text-[#cbd1d9]"
            }`}
            type="button"
            onClick={() => setScore(value)}
            disabled={isPending}
            aria-label={`${value}점 선택`}
            aria-pressed={value === score}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        className="mt-3 h-20 w-full resize-none rounded-md border border-[#e3e6eb] bg-white p-3 text-xs outline-none focus:border-[#2563eb]"
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        maxLength={500}
        disabled={isPending}
      />

      <button
        className="mt-2 h-9 w-full rounded bg-[#17191e] text-xs font-semibold text-white disabled:bg-[#969da8]"
        type="button"
        onClick={handleSave}
        disabled={isPending}
      >
        {isPending
          ? "처리 중"
          : existingRating
            ? "평점 수정"
            : "평점 저장"}
      </button>

      {existingRating && (
        <button
          className="mt-2 h-9 w-full rounded border border-[#dc2626] bg-white text-xs font-semibold text-[#dc2626] disabled:text-[#969da8]"
          type="button"
          onClick={handleDelete}
          disabled={isPending}
        >
          평점 삭제
        </button>
      )}
    </aside>
  );
}
