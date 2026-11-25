"use client";

import { useState } from "react";
import type { RatingResponse } from "@/api/ratings/get-member-ratings";
import { useCreateRatingMutation } from "@/hooks/use-create-rating-mutation";
import { useDeleteRatingMutation } from "@/hooks/use-delete-rating-mutation";
import { useUpdateRatingMutation } from "@/hooks/use-update-rating-mutation";
import { cn } from "@/utils/cn";

const RATING_SCORES = [1, 2, 3, 4, 5];
const STAR_PATH =
  "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

interface FavoriteRatingProps {
  movieId: number;
  memberId: number;
  // 아직 평점을 남기지 않은 영화면 undefined
  rating?: RatingResponse;
}

// 내 정보의 즐겨찾기 영화 아래에 내 평점을 보여주고 등록·수정·삭제
export function FavoriteRating({ movieId, memberId, rating }: FavoriteRatingProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  const createRatingMutation = useCreateRatingMutation(memberId);
  const updateRatingMutation = useUpdateRatingMutation(memberId);
  const deleteRatingMutation = useDeleteRatingMutation(memberId);
  const isPending =
    createRatingMutation.isPending ||
    updateRatingMutation.isPending ||
    deleteRatingMutation.isPending;

  const handleStartEdit = () => {
    setScore(rating?.score ?? null);
    setComment(rating?.comment ?? "");
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!score || isPending) return;
    // 한줄평을 비우고 저장하면 백엔드에서 한줄평이 지워짐
    const body = { score, comment: comment.trim() || undefined };
    const options = { onSuccess: () => setIsEditing(false) };

    if (rating) {
      updateRatingMutation.mutate({ ratingId: rating.ratingId, ...body }, options);
    } else {
      createRatingMutation.mutate({ movieId, ...body }, options);
    }
  };

  const handleDelete = () => {
    if (!rating || isPending) return;
    if (!confirm("평점을 삭제할까요?")) return;
    deleteRatingMutation.mutate(rating.ratingId);
  };

  const textButtonClass =
    "cursor-pointer text-xs leading-[14px] font-extrabold disabled:cursor-not-allowed disabled:opacity-50";

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 pt-2">
        <div aria-label="영화 별점" className="flex gap-0.5">
          {RATING_SCORES.map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`${value}점`}
              aria-pressed={score === value}
              onClick={() => setScore((prev) => (prev === value ? null : value))}
              className="flex size-7 cursor-pointer items-center justify-center rounded-md border border-[#E3E6EB] bg-white"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className={cn(
                  "size-5",
                  value <= (score ?? 0) ? "fill-[#2563EB]" : "fill-[#C9CED6]",
                )}
              >
                <path d={STAR_PATH} />
              </svg>
            </button>
          ))}
        </div>
        <textarea
          aria-label="한줄평"
          placeholder="한줄평 (선택)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          className="h-[64px] resize-none rounded-lg border border-[#E3E6EB] bg-white px-2.5 py-2 text-xs leading-[18px] text-[#17191E] outline-none placeholder:text-[#969DA8] focus:border-[#2563EB]"
        />
        <div className="flex gap-3">
          <button
            type="button"
            disabled={!score || isPending}
            onClick={handleSave}
            className={cn(textButtonClass, "text-[#2563EB]")}
          >
            {isPending ? "저장 중" : "저장"}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => setIsEditing(false)}
            className={cn(textButtonClass, "text-[#606774]")}
          >
            취소
          </button>
        </div>
      </div>
    );
  }

  if (!rating) {
    return (
      <div className="flex items-center justify-between gap-2 pt-2">
        <p className="text-xs leading-[14px] text-[#969DA8]">
          아직 평점이 없어요.
        </p>
        <button
          type="button"
          onClick={handleStartEdit}
          className={cn(textButtonClass, "text-[#2563EB]")}
        >
          평점 남기기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 pt-2">
      <div className="flex items-center justify-between gap-2">
        <div
          aria-label={`내 평점 ${rating.score}점`}
          className="flex items-center gap-0.5"
        >
          {RATING_SCORES.map((value) => (
            <svg
              key={value}
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={cn(
                "size-4",
                value <= rating.score ? "fill-[#2563EB]" : "fill-[#C9CED6]",
              )}
            >
              <path d={STAR_PATH} />
            </svg>
          ))}
          <span className="ml-1 text-xs leading-[14px] font-bold text-[#17191E]">
            {rating.score}점
          </span>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={handleStartEdit}
            className={cn(textButtonClass, "text-[#2563EB]")}
          >
            수정
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className={cn(textButtonClass, "text-[#D92D20]")}
          >
            {deleteRatingMutation.isPending ? "삭제 중" : "삭제"}
          </button>
        </div>
      </div>
      <p className="line-clamp-2 text-xs leading-[18px] text-[#606774]">
        {rating.comment || "한줄평이 없어요."}
      </p>
    </div>
  );
}
