"use client";

import { useState, type SubmitEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getMe } from "../../api/members/me";
import { getMemberRatings } from "../../api/members/get-member-ratings";
import { createRating } from "../../api/ratings/create-rating";
import { updateRating } from "../../api/ratings/update-rating";
import { deleteRating } from "../../api/ratings/delete-rating";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

const RATING_VALUES = [1, 2, 3, 4, 5];

interface MovieRatingFormProps {
  movieId: number;
}

export function MovieRatingForm({ movieId }: MovieRatingFormProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const router = useRouter();

  const [ratingInput, setRatingInput] = useState<number | null>(null);
  const [reviewInput, setReviewInput] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const memberId = meQuery.data?.memberId;

  const ratingsQuery = useQuery({
    queryKey: ["members", memberId, "ratings"],
    queryFn: () => getMemberRatings(memberId as number),
    enabled: Boolean(memberId),
    retry: false,
  });

  const myRating = ratingsQuery.data?.find(
    (item) => item.movieId === movieId,
  );

  const rating = ratingInput ?? myRating?.score ?? 0;
  const review = reviewInput ?? myRating?.comment ?? "";

  const refreshRatings = () => {
    setRatingInput(null);
    setReviewInput(null);
    queryClient.invalidateQueries({
      queryKey: ["members", memberId, "ratings"],
    });
  };

  const createMutation = useMutation({
    mutationFn: createRating,
    onSuccess: () => {
      refreshRatings();
      setIsSaved(true);
    },
    onError: () => {
      alert("평점 저장에 실패했어요. 다시 시도해 주세요.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateRating,
    onSuccess: () => {
      refreshRatings();
      setIsSaved(true);
    },
    onError: () => {
      alert("평점 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRating,
    onSuccess: () => {
      refreshRatings();
      setIsSaved(false);
    },
    onError: () => {
      alert("평점 삭제에 실패했어요. 다시 시도해 주세요.");
    },
  });

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accessToken) {
      router.push("/login");
      return;
    }

    if (rating === 0 || isPending) return;

    if (myRating) {
      updateMutation.mutate({
        ratingId: myRating.ratingId,
        score: rating,
        comment: review,
      });
      return;
    }

    createMutation.mutate({ movieId, score: rating, comment: review });
  }

  function handleDelete() {
    if (!myRating || isPending) return;
    deleteMutation.mutate(myRating.ratingId);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <h2 className="text-lg font-extrabold">내 평점</h2>
      <p className="mt-1 text-[11px] text-[#9ca3af]">
        별점은 필수, 후기는 선택이에요.
      </p>

      <div role="radiogroup" aria-label="별점" className="mt-2 flex gap-1.5">
        {RATING_VALUES.map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={rating === value}
            aria-label={`${value}점`}
            onClick={() => {
              setRatingInput(value);
              setIsSaved(false);
            }}
            className={cn(
              "grid size-8 cursor-pointer place-items-center rounded-md border border-[#e5e7eb] bg-white text-lg leading-none",
              value <= rating ? "text-[#f5b400]" : "text-[#6b7280]",
            )}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        aria-label="후기"
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        value={review}
        onChange={(event) => {
          setReviewInput(event.target.value);
          setIsSaved(false);
        }}
        className="mt-2.5 h-[88px] resize-none rounded-lg border border-[#e5e7eb] bg-white p-3 text-xs outline-none placeholder:text-[#9ca3af] focus:border-[#111]"
      />

      <button
        type="submit"
        disabled={rating === 0 || isPending}
        className="mt-2 h-9 cursor-pointer rounded-md bg-[#111] text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        평점 저장
      </button>

      {myRating && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="mt-2 h-9 cursor-pointer rounded-md border border-[#e5e7eb] bg-white text-xs font-bold text-[#6b7280] disabled:cursor-not-allowed disabled:opacity-40"
        >
          평점 삭제
        </button>
      )}

      {isSaved && (
        <p role="status" className="mt-2 text-[11px] text-[#2563EB]">
          평점을 저장했어요.
        </p>
      )}
    </form>
  );
}