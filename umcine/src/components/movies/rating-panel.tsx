import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRating,
  deleteRating,
  getRatings,
  updateRating,
  type Rating,
  type RatingInput,
} from "../../api/ratings";
import { useAuthStore } from "../../stores/auth-store";
import { getMemberId } from "../../utils/get-member-id";
import { cn } from "../../utils/cn";

export default function RatingPanel({ movieId }: { movieId: number }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberId(accessToken);

  const ratingsQuery = useQuery({
    queryKey: ["ratings", memberId],
    queryFn: () => getRatings(memberId!),
    enabled: Boolean(memberId),
    retry: false,
  });

  if (!memberId) {
    return (
      <section>
        <h2 className="text-xl font-bold">내 평점</h2>

        <p className="mt-3 text-sm text-gray-500">
          로그인 후 평점과 후기를 남길 수 있어요.
        </p>

        <Link to="/login" className="mt-3 inline-block text-sm text-blue-600">
          로그인하기
        </Link>
      </section>
    );
  }

  if (ratingsQuery.isPending) {
    return (
      <p role="status" className="text-sm text-gray-500">
        평점을 불러오는 중이에요.
      </p>
    );
  }

  if (ratingsQuery.isError) {
    return (
      <section>
        <p role="alert" className="text-sm text-red-600">
          평점을 불러오지 못했어요.
        </p>

        <button
          type="button"
          onClick={() => void ratingsQuery.refetch()}
          disabled={ratingsQuery.isFetching}
          className="mt-3 text-sm text-blue-600 disabled:opacity-50"
        >
          다시 시도
        </button>
      </section>
    );
  }

  const rating = ratingsQuery.data.find((item) => item.movieId === movieId);

  return (
    <RatingForm
      key={`${memberId}:${movieId}:${rating?.ratingId ?? "new"}:${rating?.updatedAt ?? ""}`}
      movieId={movieId}
      memberId={memberId}
      rating={rating}
    />
  );
}

function RatingForm({
  movieId,
  memberId,
  rating,
}: {
  movieId: number;
  memberId: string;
  rating: Rating | undefined;
}) {
  const queryClient = useQueryClient();

  const [score, setScore] = useState(rating?.score ?? 0);
  const [comment, setComment] = useState(rating?.comment ?? "");

  const saveMutation = useMutation({
    mutationFn: (body: RatingInput) =>
      rating
        ? updateRating(rating.ratingId, body)
        : createRating({ movieId, ...body }),
    onSuccess: (savedRating) => {
      queryClient.setQueryData<Rating[]>(
        ["ratings", memberId],
        (previous = []) => [
          savedRating,
          ...previous.filter((item) => item.movieId !== movieId),
        ],
      );

      alert("평점을 저장했어요.");
    },
    onError: () => {
      alert("평점 저장에 실패했어요. 다시 시도해 주세요.");

      void queryClient.invalidateQueries({
        queryKey: ["ratings", memberId],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRating,
    onSuccess: (_, ratingId) => {
      queryClient.setQueryData<Rating[]>(
        ["ratings", memberId],
        (previous = []) =>
          previous.filter((item) => item.ratingId !== ratingId),
      );

      alert("평점을 삭제했어요.");
    },
    onError: () => {
      alert("평점 삭제에 실패했어요. 다시 시도해 주세요.");

      void queryClient.invalidateQueries({
        queryKey: ["ratings", memberId],
      });
    },
  });

  const isPending = saveMutation.isPending || deleteMutation.isPending;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (score < 1 || score > 5 || comment.length > 500 || isPending) return;

    saveMutation.mutate({
      score,
      comment: comment.trim(),
    });
  };

  return (
    <section>
      <h2 className="text-xl font-bold">내 평점</h2>

      <p className="mt-1 text-xs text-gray-400">
        별점은 필수, 후기는 선택이에요.
      </p>

      <form onSubmit={handleSubmit}>
        <div
          className="mt-3 flex gap-2"
          role="radiogroup"
          aria-label="영화 평점"
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={score === value}
              aria-label={`${value}점`}
              disabled={isPending}
              onClick={() => setScore(value)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-md border bg-white text-lg disabled:cursor-not-allowed disabled:opacity-50",
                value <= score
                  ? "border-gray-500 text-gray-600"
                  : "border-gray-200 text-gray-300",
              )}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          maxLength={500}
          disabled={isPending}
          aria-label="영화 후기"
          placeholder="영화를 보고 느낀 점을 남겨보세요."
          className="mt-3 h-[100px] w-full resize-none rounded-lg border border-gray-200 bg-white p-4 text-sm outline-none focus:border-blue-500 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={score === 0 || isPending}
          className="mt-3 h-10 w-full rounded-md bg-[#191B20] text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {saveMutation.isPending
            ? "저장 중…"
            : rating
              ? "평점 수정"
              : "평점 저장"}
        </button>

        {rating && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              if (!isPending && confirm("평점을 삭제할까요?")) {
                deleteMutation.mutate(rating.ratingId);
              }
            }}
            className="mt-2 h-10 w-full rounded-md border border-red-300 text-sm font-bold text-red-600 disabled:opacity-50"
          >
            {deleteMutation.isPending ? "삭제 중…" : "평점 삭제"}
          </button>
        )}
      </form>
    </section>
  );
}