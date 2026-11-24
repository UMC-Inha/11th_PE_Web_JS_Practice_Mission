import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getMemberRatings } from "../../api/ratings/get-member-ratings";
import { useMyMemberId } from "../../hooks/use-my-member-id";
import {
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useUpdateRatingMutation,
} from "../../hooks/use-rating-mutations";
import { cn } from "../../utils/cn";

const STARS = [1, 2, 3, 4, 5];

interface MyRatingPanelProps {
  movieId: number;
}

export function MyRatingPanel({ movieId }: MyRatingPanelProps) {
  const memberId = useMyMemberId();

  const myRatingsQuery = useQuery({
    queryKey: ["ratings", "member", memberId],
    queryFn: () => getMemberRatings(memberId!),
    enabled: memberId !== null,
  });

  // 내 평점 목록 중 이 영화의 평점 (없으면 아직 안 남긴 것)
  const myRating = myRatingsQuery.data?.find((rating) => rating.movieId === movieId);

  // 사용자가 고치기 전에는 null이라서 서버에 저장된 값을 그대로 보여 줌
  const [editedScore, setEditedScore] = useState<number | null>(null);
  const [editedComment, setEditedComment] = useState<string | null>(null);
  const score = editedScore ?? myRating?.score ?? 0;
  const comment = editedComment ?? myRating?.comment ?? "";

  const createMutation = useCreateRatingMutation();
  const updateMutation = useUpdateRatingMutation();
  const deleteMutation = useDeleteRatingMutation();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const resetEdits = () => {
    setEditedScore(null);
    setEditedComment(null);
  };

  const handleSave = () => {
    if (score < 1 || isSaving) return;

    if (myRating) {
      updateMutation.mutate(
        { ratingId: myRating.ratingId, score, comment: comment.trim() },
        { onSuccess: resetEdits },
      );
    } else {
      createMutation.mutate(
        { movieId, score, comment: comment.trim() },
        { onSuccess: resetEdits },
      );
    }
  };

  const handleDelete = () => {
    if (!myRating || deleteMutation.isPending) return;
    deleteMutation.mutate(myRating.ratingId, { onSuccess: resetEdits });
  };

  if (memberId === null) {
    return (
      <aside className="w-85 shrink-0 border-l border-gray-200 pl-10">
        <h2 className="text-base font-bold">내 평점</h2>
        <p className="mt-3 text-sm text-gray-500">로그인하면 평점을 남길 수 있어요.</p>
        <Link
          href="/login"
          className="mt-3 block w-full rounded-lg bg-[#111111] py-3 text-center text-sm font-semibold text-white"
        >
          로그인
        </Link>
      </aside>
    );
  }

  return (
    <aside className="w-85 shrink-0 border-l border-gray-200 pl-10">
      <h2 className="text-base font-bold">내 평점</h2>
      <p className="mt-1 text-xs text-gray-400">별점은 필수, 후기는 선택이에요.</p>
      <div className="mt-3 flex gap-2">
        {STARS.map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setEditedScore(star)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md border bg-white",
              star <= score ? "border-[#4f5de8]" : "border-gray-200",
            )}
          >
            <img
              src="/icons/star.svg"
              alt={`${star}점`}
              className={cn("h-5 w-5", star <= score ? "opacity-100" : "opacity-20")}
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setEditedComment(e.target.value)}
        maxLength={500}
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        className="mt-4 h-24 w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none placeholder:text-gray-400"
      />
      <button
        type="button"
        onClick={handleSave}
        disabled={score < 1 || isSaving}
        className="mt-3 w-full rounded-lg bg-[#111111] py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isSaving ? "저장 중" : myRating ? "평점 수정" : "평점 저장"}
      </button>
      {myRating && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="mt-2 w-full rounded-lg border border-red-300 py-3 text-sm font-semibold text-red-600 disabled:opacity-40"
        >
          {deleteMutation.isPending ? "삭제 중" : "평점 삭제"}
        </button>
      )}
    </aside>
  );
}
