import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRating } from "../../api/ratings/create-rating";
import { updateRating } from "../../api/ratings/update-rating";
import { deleteRating } from "../../api/ratings/delete-rating";
import type { Rating, RatingInput } from "../../api/ratings/models";

interface RatingFormProps {
  memberId: number;
  movieId: number;
  rating: Rating | null;
}

export function RatingForm({
  memberId,
  movieId,
  rating,
}: RatingFormProps) {
  const queryClient = useQueryClient();

  const [score, setScore] = useState(rating?.score ?? 0);
  const [comment, setComment] = useState(rating?.comment ?? "");

  const ratingQueryKey = [
    "ratings",
    "member",
    memberId,
    "movie",
    movieId,
  ];

  const saveMutation = useMutation({
    mutationFn: (body: RatingInput) => {
      if (rating) {
        return updateRating(rating.ratingId, body);
      }

      return createRating({
        movieId,
        ...body,
      });
    },

    onSuccess: (savedRating) => {
      queryClient.setQueryData<Rating | null>(
        ratingQueryKey,
        savedRating,
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRating,

    onSuccess: () => {
      queryClient.setQueryData<Rating | null>(
        ratingQueryKey,
        null,
      );
    },
  });

  const isPending =
    saveMutation.isPending || deleteMutation.isPending;

  return (
    <form
      className="mt-3"
      onSubmit={(event) => {
        event.preventDefault();

        if (
          isPending ||
          !Number.isInteger(score) ||
          score < 1 ||
          score > 5
        ) {
          return;
        }

        saveMutation.mutate({ score, comment });
      }}
    >
      <fieldset
        disabled={isPending}
        className="m-0 min-w-0 border-0 p-0"
      >
        <legend className="sr-only">별점과 후기</legend>

        <p className="text-sm">
          {score > 0 ? `선택한 별점: ${score}점` : "별점을 선택해 주세요."}
        </p>

        <div className="mt-3 flex gap-2">
          {Array.from({ length: 5 }, (_, index) => {
            const value = index + 1;
            const isSelected = value <= score;

            return (
              <button
                key={value}
                type="button"
                aria-label={`${value}점`}
                aria-pressed={isSelected}
                className={`grid size-9 cursor-pointer place-items-center rounded disabled:cursor-not-allowed ${
                  isSelected ? "bg-yellow-100" : "bg-[#ededf0]"
                }`}
                onClick={() => setScore(value)}
              >
                <img
                  src="/icons/star.svg"
                  alt=""
                  className={`size-5 ${
                    isSelected ? "opacity-100" : "opacity-30"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <label
          htmlFor={`rating-comment-${movieId}`}
          className="mt-4 block text-sm"
        >
          후기
        </label>

        <textarea
          id={`rating-comment-${movieId}`}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          maxLength={500}
          placeholder="영화를 보고 느낀 점을 남겨보세요."
          className="mt-2 h-25 w-full resize-none rounded-md border border-[#e6e6e8] bg-white p-3 text-sm"
        />

        <p className="mt-1 text-right text-xs text-gray-500">
          {comment.length}/500
        </p>

        <button
          type="submit"
          disabled={isPending || score < 1 || score > 5}
          className="mt-2 h-10 w-full cursor-pointer rounded-md bg-[#1b1b22] text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saveMutation.isPending
            ? "저장 중..."
            : rating
              ? "평점 수정"
              : "평점 저장"}
        </button>

        {rating && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              if (isPending) return;

              deleteMutation.mutate(rating.ratingId);
            }}
            className="mt-2 h-10 w-full cursor-pointer rounded-md border border-red-500 text-sm font-semibold text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleteMutation.isPending ? "삭제 중..." : "평점 삭제"}
          </button>
        )}
      </fieldset>

      {(saveMutation.isError || deleteMutation.isError) && (
        <p role="alert" className="mt-2 text-sm text-red-500">
          평점을 변경하지 못했어요. 다시 시도해 주세요.
        </p>
      )}
    </form>
  );
}