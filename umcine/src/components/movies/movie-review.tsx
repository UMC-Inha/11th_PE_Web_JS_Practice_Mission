import { useState, type SubmitEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRating, deleteRating, updateRating, type Rating } from "../../api/ratings/ratings";
import { useAuthStore } from "../../stores/auth-store";
import { useMyRatings } from "../../hooks/use-my-ratings";

export function MovieReview({ movieId }: { movieId: number }) {
  const token = useAuthStore((state) => state.accessToken);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const ratingsQuery = useMyRatings();
  const savedRating = ratingsQuery.data?.find((rating) => rating.movieId === movieId);

  if (token && ratingsQuery.isPending) return <div className="h-64 animate-pulse rounded-lg bg-gray-100" aria-busy="true" />;
  if (token && ratingsQuery.isError) return <div role="alert" className="text-sm text-gray-500">
    내 평점을 불러오지 못했어요. <button type="button" className="text-blue-600" onClick={() => void ratingsQuery.refetch()}>다시 시도</button>
  </div>;

  return <ReviewForm key={`${movieId}-${savedRating?.ratingId ?? "new"}`} movieId={movieId} token={token} savedRating={savedRating} queryClient={queryClient} navigate={navigate} />;
}

type ReviewFormProps = {
  movieId: number;
  token: string | null;
  savedRating: Rating | undefined;
  queryClient: ReturnType<typeof useQueryClient>;
  navigate: ReturnType<typeof useNavigate>;
};

function ReviewForm({ movieId, token, savedRating, queryClient, navigate }: ReviewFormProps) {
  const [score, setScore] = useState(savedRating?.score ?? 0);
  const [comment, setComment] = useState(savedRating?.comment ?? "");
  const [message, setMessage] = useState("");
  const mutation = useMutation({
    mutationFn: async (action: "save" | "delete") => {
      if (!token || useAuthStore.getState().accessToken !== token) throw new Error("로그인이 필요해요.");
      if (action === "delete") {
        if (!savedRating) throw new Error("삭제할 평점이 없어요.");
        await deleteRating(savedRating.ratingId);
        return null;
      }
      const input = { movieId, score, comment: comment.trim() };
      return savedRating ? updateRating(savedRating.ratingId, input) : createRating(input);
    },
    onSuccess: (result) => {
      if (useAuthStore.getState().accessToken !== token) return;
      queryClient.setQueryData<Rating[]>(["ratings", "me", token], (previous) => {
        if (!previous) return previous;
        const rest = previous.filter((rating) => rating.movieId !== movieId);
        return result ? [...rest, result] : rest;
      });
      if (result === null) {
        setScore(0);
        setComment("");
      }
      setMessage(result ? "평점을 저장했어요." : "평점을 삭제했어요.");
      void queryClient.invalidateQueries({ queryKey: ["ratings", "me", token] });
    },
    onError: (error) => setMessage(error instanceof Error ? error.message : "평점 요청에 실패했어요. 다시 시도해 주세요."),
  });

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      void navigate({ to: "/login" });
      return;
    }
    if (!Number.isInteger(score) || score < 1 || score > 5 || mutation.isPending) {
      setMessage("별점을 1~5점 중에서 선택해 주세요.");
      return;
    }
    mutation.mutate("save");
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-[#e2e5eb] pt-6 lg:border-l lg:border-t-0 lg:pl-[30px] lg:pt-0">
      <h2 className="text-[21px] font-bold tracking-[-1px]">내 평점</h2>
      <p className="mb-2 mt-2 text-xs text-[#969DA8]">별점은 필수, 후기는 선택이에요.</p>
      {savedRating && <p className="mb-2 text-xs text-blue-600">저장된 평점: {savedRating.score}점</p>}
      <div role="group" aria-label="영화 별점" className="mb-2 flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button key={value} type="button" aria-label={`${value}점`} aria-pressed={score === value}
            disabled={mutation.isPending} onClick={() => { setScore(value); setMessage(""); }}
            className="grid h-[38px] w-[38px] place-items-center rounded-[8px] border border-[#e2e5eb] bg-white">
            <svg aria-hidden="true" viewBox="0 0 24 24" className={`h-6 w-6 ${value <= score ? "text-blue-600" : "text-[#6b7280]"}`} fill="currentColor">
              <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
            </svg>
          </button>
        ))}
      </div>
      <textarea aria-label="영화 후기" placeholder="영화에 대한 생각을 남겨보세요." value={comment}
        disabled={mutation.isPending} onChange={(event) => { setComment(event.target.value); setMessage(""); }}
        className="block h-[102px] w-full resize-none rounded-[8px] border border-[#e2e5eb] bg-white p-3 text-sm leading-6 outline-none placeholder:text-[#969DA8] focus:border-blue-600" />
      <button type="submit" disabled={mutation.isPending} className="mt-2 h-10 w-full rounded-[8px] bg-[#17191e] text-sm font-bold text-white disabled:opacity-50">
        {mutation.isPending ? "처리 중" : savedRating ? "평점 수정" : "평점 등록"}
      </button>
      {savedRating && <button type="button" disabled={mutation.isPending} onClick={() => mutation.mutate("delete")}
        className="mt-2 text-sm text-red-500 disabled:opacity-50">평점 삭제</button>}
      <p role="status" className="mt-2 min-h-5 text-xs text-[#606774]">{message}</p>
    </form>
  );
}
