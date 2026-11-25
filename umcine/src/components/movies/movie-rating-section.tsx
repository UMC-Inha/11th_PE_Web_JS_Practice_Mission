"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { Rating } from "../../api/ratings/get-member-ratings";
import { useCreateRatingMutation } from "../../hooks/use-create-rating-mutation";
import { useDeleteRatingMutation } from "../../hooks/use-delete-rating-mutation";
import { useUpdateRatingMutation } from "../../hooks/use-update-rating-mutation";
import { memberRatingsQueryOptions } from "../../queries/rating-queries";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";
import { getMemberIdFromToken } from "../../utils/get-member-id-from-token";

const RATING_VALUES = [1, 2, 3, 4, 5];

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("h-5 w-5", filled ? "text-app-accent" : "text-gray-400")}
    >
      <path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.58L12 17.77l-5.9 3.1 1.13-6.58L2.45 9.44l6.6-.96L12 2.5z" />
    </svg>
  );
}

interface RatingFormProps {
  movieId: number;
  rating: Rating | undefined; // 이미 남긴 평점이 있으면 수정, 없으면 등록
}

function RatingForm({ movieId, rating }: RatingFormProps) {
  const [score, setScore] = useState(rating?.score ?? 0);
  const [comment, setComment] = useState(rating?.comment ?? "");
  const createMutation = useCreateRatingMutation();
  const updateMutation = useUpdateRatingMutation();
  const deleteMutation = useDeleteRatingMutation();

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const handleSave = () => {
    if (score === 0 || isPending) return;

    if (rating) {
      updateMutation.mutate({
        ratingId: rating.ratingId,
        score,
        comment: comment.trim(),
      });
    } else {
      createMutation.mutate({ movieId, score, comment: comment.trim() });
    }
  };

  const handleDelete = () => {
    if (!rating || isPending) return;
    if (!confirm("내 평점을 삭제할까요?")) return;
    deleteMutation.mutate(rating.ratingId);
  };

  return (
    <>
      <div className="mt-3 flex gap-2">
        {RATING_VALUES.map((value) => (
          <button
            key={value}
            type="button"
            aria-label={`${value}점`}
            aria-pressed={score === value}
            onClick={() => setScore(value)}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-white"
          >
            <StarIcon filled={value <= score} />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        className="mt-3 h-28 w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-sm text-app-text-h outline-none placeholder:text-gray-400"
      />
      <button
        type="button"
        disabled={score === 0 || isPending}
        onClick={handleSave}
        className="mt-3 w-full rounded-lg border-none bg-gray-900 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPending ? "처리 중" : rating ? "평점 수정" : "평점 저장"}
      </button>
      {rating && (
        <button
          type="button"
          disabled={isPending}
          onClick={handleDelete}
          className="mt-2 w-full rounded-lg border border-gray-200 bg-white py-3 text-sm font-bold text-app-text-h disabled:cursor-not-allowed disabled:opacity-40"
        >
          평점 삭제
        </button>
      )}
    </>
  );
}

function MovieRatingSection({ movieId }: { movieId: number }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberIdFromToken(accessToken);
  const { data: ratings, isPending, isError } = useQuery(
    memberRatingsQueryOptions(memberId, Boolean(accessToken)),
  );

  let content;
  if (!accessToken) {
    content = (
      <p className="mt-3 text-sm text-app-text">
        평점은 로그인 후에 남길 수 있어요.{" "}
        <Link href="/login" className="font-bold text-app-accent no-underline">
          로그인
        </Link>
      </p>
    );
  } else if (memberId === null) {
    content = (
      <p role="alert" className="mt-3 text-sm text-app-text">
        회원 정보를 확인하지 못했어요. 다시 로그인해 주세요.
      </p>
    );
  } else if (isPending) {
    content = (
      <p role="status" className="mt-3 text-sm text-app-text">
        내 평점을 불러오는 중이에요.
      </p>
    );
  } else if (isError) {
    content = (
      <p role="alert" className="mt-3 text-sm text-app-text">
        내 평점을 불러오지 못했어요.
      </p>
    );
  } else {
    const rating = ratings.find((item) => item.movieId === movieId);
    // 평점이 생기거나 사라지면 폼 상태를 서버 값으로 새로 시작함
    content = (
      <RatingForm
        key={rating?.ratingId ?? "new"}
        movieId={movieId}
        rating={rating}
      />
    );
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-app-text-h">내 평점</h2>
      <p className="mt-1 text-sm text-app-text">
        별점은 필수, 후기는 선택이에요.
      </p>
      {content}
    </div>
  );
}

export default MovieRatingSection;
