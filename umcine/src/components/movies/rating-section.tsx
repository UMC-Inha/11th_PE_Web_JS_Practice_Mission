import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { getMe } from "../../api/members/me";
import { getMemberRatings } from "../../api/members/get-member-ratings";
import { createRating } from "../../api/ratings/create-rating";
import { updateRating } from "../../api/ratings/update-rating";
import { deleteRating } from "../../api/ratings/delete-rating";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

interface RatingSectionProps {
  movieId: number;
}

const SCORES = [1, 2, 3, 4, 5];

export function RatingSection({ movieId }: RatingSectionProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [scoreInput, setScoreInput] = useState<number | null>(null);
  const [commentInput, setCommentInput] = useState<string | null>(null);

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
    (rating) => rating.movieId === movieId,
  );

  const score = scoreInput ?? myRating?.score ?? 0;
  const comment = commentInput ?? myRating?.comment ?? "";

  const resetInput = () => {
    setScoreInput(null);
    setCommentInput(null);
  };

  const refreshRatings = () => {
    queryClient.invalidateQueries({
      queryKey: ["members", memberId, "ratings"],
    });
  };

  const createMutation = useMutation({
    mutationFn: createRating,
    onSuccess: () => {
      resetInput();
      refreshRatings();
      alert("평점을 등록했어요.");
    },
    onError: () => {
      alert("평점 등록에 실패했어요. 다시 시도해 주세요.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateRating,
    onSuccess: () => {
      resetInput();
      refreshRatings();
      alert("평점을 수정했어요.");
    },
    onError: () => {
      alert("평점 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRating,
    onSuccess: () => {
      resetInput();
      refreshRatings();
      alert("평점을 삭제했어요.");
    },
    onError: () => {
      alert("평점 삭제에 실패했어요. 다시 시도해 주세요.");
    },
  });

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (score < 1 || isPending) return;

    if (myRating) {
      updateMutation.mutate({ ratingId: myRating.ratingId, score, comment });
      return;
    }

    createMutation.mutate({ movieId, score, comment });
  };

  const handleDelete = () => {
    if (!myRating || isPending) return;
    deleteMutation.mutate(myRating.ratingId);
  };

  if (!accessToken) {
    return (
      <section>
        <h2 className="text-[15px] font-extrabold text-[#111]">평점</h2>
        <p className="mt-2 text-xs leading-[1.8] text-[#888]">
          로그인하면 이 영화에 평점을 남길 수 있어요.
        </p>
        <button
          type="button"
          onClick={() => navigate({ to: "/login" })}
          className="mt-4 h-9 cursor-pointer rounded-md bg-[#2563EB] px-3.5 text-xs font-bold text-white"
        >
          로그인하기
        </button>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-[15px] font-extrabold text-[#111]">
        {myRating ? "내 평점" : "평점 남기기"}
      </h2>

      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
        <div className="flex items-center gap-0.5">
          {SCORES.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setScoreInput(value)}
              disabled={isPending}
              aria-label={`${value}점`}
              className={cn(
                "grid size-8 cursor-pointer place-items-center rounded-md text-xl disabled:cursor-not-allowed",
                value <= score ? "text-[#2563EB]" : "text-[#e5e7eb]",
              )}
            >
              ★
            </button>
          ))}
          <span className="ml-1 text-xs font-bold text-[#555]">
            {score > 0 ? `${score}점` : ""}
          </span>
        </div>

        <input
          type="text"
          value={comment}
          onChange={(e) => setCommentInput(e.target.value)}
          disabled={isPending}
          placeholder="한줄평 (선택)"
          maxLength={500}
          className="h-9 w-full rounded-md border border-[#e5e7eb] px-3 text-xs text-[#111] outline-none placeholder:text-[#9ca3af] focus:border-[#2563EB]"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={score < 1 || isPending}
            className="h-9 flex-1 cursor-pointer rounded-md bg-[#2563EB] text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {myRating ? "수정" : "등록"}
          </button>

          {myRating && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="h-9 cursor-pointer rounded-md border border-[#D92D20] bg-white px-3.5 text-xs font-bold text-[#D92D20] disabled:cursor-not-allowed disabled:opacity-50"
            >
              삭제
            </button>
          )}
        </div>
      </form>
    </section>
  );
}