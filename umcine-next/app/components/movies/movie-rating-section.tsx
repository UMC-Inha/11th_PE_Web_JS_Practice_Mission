"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getMe } from "@/api/members/me";
import { queryKeys } from "@/api/query-keys";
import { createRating } from "@/api/ratings/create-rating";
import { deleteRating } from "@/api/ratings/delete-rating";
import {
  getMemberRatings,
  type MemberRating,
} from "@/api/ratings/get-member-ratings";
import { updateRating } from "@/api/ratings/update-rating";
import { useAuthStore } from "@/stores/auth-store";
import { getServerErrorMessage } from "@/utils/get-server-error-message";

interface RatingFormProps {
  movieId: number;
  memberId: number;
  rating: MemberRating | undefined;
}

function RatingForm({ movieId, memberId, rating }: RatingFormProps) {
  const queryClient = useQueryClient();
  const [score, setScore] = useState(rating?.score ?? 0);
  const [comment, setComment] = useState(rating?.comment ?? "");

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.ratings(memberId) });
  const handleError = async (error: unknown) =>
    alert(await getServerErrorMessage(error));

  const createMutation = useMutation({
    mutationFn: () =>
      createRating({ movieId, score, comment: comment.trim() || undefined }),
    onSuccess: refresh,
    onError: handleError,
  });

  const updateMutation = useMutation({
    mutationFn: (ratingId: number) =>
      updateRating(ratingId, { score, comment: comment.trim() || undefined }),
    onSuccess: refresh,
    onError: handleError,
  });

  const deleteMutation = useMutation({
    mutationFn: (ratingId: number) => deleteRating(ratingId),
    onSuccess: refresh,
    onError: handleError,
  });

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const handleSave = () => {
    if (score < 1) {
      alert("별점을 선택해 주세요.");
      return;
    }
    if (rating) updateMutation.mutate(rating.ratingId);
    else createMutation.mutate();
  };

  const handleDelete = () => {
    if (!rating) return;
    if (window.confirm("이 평점을 삭제할까요?")) {
      deleteMutation.mutate(rating.ratingId);
    }
  };

  return (
    <>
      <div className="mb-4 flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setScore(n)}
            className="cursor-pointer border-none bg-transparent p-0"
          >
            <img
              src={n <= score ? "/icons/star.svg" : "/icons/star-outline.svg"}
              alt={`${n}점`}
              className="size-[22px]"
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mb-3 min-h-[90px] w-full resize-y rounded-lg border border-gray-200 px-3 py-2.5 text-gray-900"
        placeholder="영화를 보고 느낀 점을 남겨보세요."
      />
      <div className="flex gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={handleSave}
          className="w-full cursor-pointer rounded-lg bg-gray-900 p-3 text-sm font-semibold text-white disabled:cursor-default disabled:bg-gray-400"
        >
          {rating ? "평점 수정" : "평점 저장"}
        </button>
        {rating && (
          <button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className="shrink-0 cursor-pointer rounded-lg border border-red-500 bg-white px-4 text-sm font-semibold text-red-600 disabled:cursor-default disabled:opacity-50"
          >
            삭제
          </button>
        )}
      </div>
    </>
  );
}

interface MovieRatingSectionProps {
  movieId: number;
}

export function MovieRatingSection({ movieId }: MovieRatingSectionProps) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: queryKeys.me,
    queryFn: getMe,
    enabled: !!accessToken,
  });
  const memberId = meQuery.data?.memberId;

  const ratingsQuery = useQuery({
    queryKey: queryKeys.ratings(memberId ?? 0),
    queryFn: () => getMemberRatings(memberId as number),
    enabled: memberId !== undefined,
  });

  const myRating = ratingsQuery.data?.find((item) => item.movieId === movieId);

  return (
    <div className="w-full shrink-0 border-t border-gray-200 pt-6 text-left lg:w-[260px] lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
      <h2 className="mb-1 text-lg font-bold text-gray-900">내 평점</h2>
      <p className="mb-3 text-[13px] text-gray-500">
        별점은 필수, 후기는 선택이에요.
      </p>

      {!accessToken ? (
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full cursor-pointer rounded-lg bg-gray-900 p-3 text-sm font-semibold text-white"
        >
          로그인하고 평점 남기기
        </button>
      ) : memberId === undefined || ratingsQuery.isPending ? (
        <p className="text-sm text-gray-500">불러오는 중이에요.</p>
      ) : (
        <RatingForm
          key={myRating?.ratingId ?? "new"}
          movieId={movieId}
          memberId={memberId}
          rating={myRating}
        />
      )}
    </div>
  );
}
