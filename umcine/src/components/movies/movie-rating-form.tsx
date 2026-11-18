import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { createRating, deleteRating, getMemberRatings, updateRating, type Rating } from "../../api/ratings";
import { useAuthStore } from "../../stores/auth-store";
import { getAuthMemberId } from "../../utils/auth-member-id";
import { cn } from "../../utils/cn";

const panelClass = "border-t border-[#e2e5eb] pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8";
type RatingChange =
  | { action: "save"; ratingId?: Rating["ratingId"]; score: number; comment: string | null }
  | { action: "delete"; ratingId: Rating["ratingId"] };

export function MovieRatingForm({ movieId }: { movieId: number }) {
  const token = useAuthStore((state) => state.accessToken);
  const memberId = getAuthMemberId(token);

  return (
    <section className={panelClass} aria-labelledby="movie-rating-heading">
      <h2 id="movie-rating-heading" className="text-xl font-bold">내 평점</h2>
      {memberId === null ? (
        <Link to="/login" className="mt-2 inline-block text-sm font-semibold text-blue-700">로그인하고 평점 남기기</Link>
      ) : <RatingEditor key={`${memberId}:${movieId}`} memberId={memberId} movieId={movieId} />}
    </section>
  );
}

function RatingEditor({ memberId, movieId }: { memberId: number; movieId: number }) {
  const queryClient = useQueryClient();
  const queryKey = ["members", memberId, "ratings"] as const;
  const ratings = useQuery({
    queryKey,
    queryFn: ({ signal }) => getMemberRatings(memberId, signal),
    retry: false,
  });
  const saved = ratings.data?.find((item) => Number(item.movieId) === movieId);
  const [draftScore, setDraftScore] = useState<number | null>(null);
  const [draftReview, setDraftReview] = useState<string | null>(null);
  const score = draftScore ?? saved?.score ?? 0;
  const review = draftReview ?? saved?.comment ?? "";

  const mutation = useMutation({
    mutationFn: async (change: RatingChange) => {
      if (change.action === "delete") {
        await deleteRating(change.ratingId);
        return null;
      }
      const input = { score: change.score, comment: change.comment };
      return change.ratingId === undefined
        ? createRating(movieId, input)
        : updateRating(change.ratingId, input);
    },
    onSuccess: async (result) => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<Rating[]>(queryKey, (previous = []) => {
        const otherRatings = previous.filter((item) => Number(item.movieId) !== movieId);
        return result ? [result, ...otherRatings] : otherRatings;
      });
      setDraftScore(null);
      setDraftReview(null);
    },
    onError: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  function save(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!score || mutation.isPending || !ratings.data) return;
    mutation.mutate({ action: "save", ratingId: saved?.ratingId, score, comment: review.trim() || null });
  }

  if (ratings.isPending) return <p role="status" className="mt-2 text-sm">평점을 불러오는 중이에요.</p>;
  if (ratings.isError && !ratings.data) {
    return (
      <div className="mt-2 text-sm">
        <p role="alert">평점을 불러오지 못했어요.</p>
        <button type="button" onClick={() => void ratings.refetch()} className="mt-2 font-semibold text-blue-700">다시 시도</button>
      </div>
    );
  }

  return (
    <form onSubmit={save}>
      <p className="mt-2 text-xs text-[#677080]">별점은 필수, 후기는 선택이에요.</p>
      <div role="group" aria-label="별점 선택" className="mt-2 flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button key={value} type="button" aria-label={`${value}점`} aria-pressed={score === value}
            disabled={mutation.isPending} onClick={() => { setDraftScore(value); mutation.reset(); }}
            className={cn("flex h-10 w-10 items-center justify-center rounded-lg border border-[#dce1e8] bg-white text-2xl",
              value <= score ? "text-[#2864fa]" : "text-[#687180]")}>★</button>
        ))}
      </div>
      <textarea aria-label="영화 후기" value={review} maxLength={500} readOnly={mutation.isPending}
        onChange={(event) => { setDraftReview(event.target.value); mutation.reset(); }}
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        className="mt-2 h-25.5 w-full resize-none rounded-lg border border-[#dce1e8] bg-white p-3 text-sm placeholder:text-[#939baa]" />
      <div className="mt-2 flex gap-2">
        <button type="submit" disabled={!score || mutation.isPending}
          className="h-10 flex-1 rounded-md bg-[#181a20] text-sm font-bold text-white disabled:opacity-50">
          {mutation.isPending && mutation.variables?.action === "save" ? "저장 중" : saved ? "평점 수정" : "평점 저장"}
        </button>
        {saved && (
          <button type="button" disabled={mutation.isPending}
            onClick={() => mutation.mutate({ action: "delete", ratingId: saved.ratingId })}
            className="rounded-md border border-red-300 bg-white px-3 text-sm font-bold text-red-700 disabled:opacity-50">
            {mutation.isPending && mutation.variables?.action === "delete" ? "삭제 중" : "삭제"}
          </button>
        )}
      </div>
      {mutation.isError && <p role="alert" className="mt-2 text-xs text-red-700">평점 변경에 실패했어요. 다시 시도해 주세요.</p>}
      {mutation.isSuccess && <p role="status" className="mt-2 text-xs text-[#677080]">{mutation.data ? "평점을 저장했어요." : "평점을 삭제했어요."}</p>}
    </form>
  );
}
