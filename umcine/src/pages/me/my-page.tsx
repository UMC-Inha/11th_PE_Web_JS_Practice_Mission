import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type SubmitEvent } from "react";
import { createRating } from "../../api/members/create-rating";
import { deleteRating } from "../../api/members/delete-rating";
import { getMemberRatings } from "../../api/members/get-member-ratings";
import type { MemberRating } from "../../api/members/get-member-ratings";
import { updateRating } from "../../api/members/update-rating";
import { getServerErrorMessage } from "../../utils/get-server-error-message";

const MEMBER_ID = 1;
const MEMBER_NAME = "수현";
const RATINGS_QUERY_KEY = ["members", MEMBER_ID, "ratings"];

const inputClassName =
  "rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none";

interface RatingItemProps {
  rating: MemberRating;
}

function RatingItem({ rating }: RatingItemProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [score, setScore] = useState(String(rating.score));
  const [comment, setComment] = useState(rating.comment ?? "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateMutation = useMutation({
    mutationFn: () =>
      updateRating(MEMBER_ID, rating.ratingId, {
        score: Number(score),
        comment: comment.trim() || undefined,
      }),
    onSuccess: () => {
      setIsEditing(false);
      return queryClient.invalidateQueries({ queryKey: RATINGS_QUERY_KEY });
    },
    onError: async (error) => setErrorMessage(await getServerErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteRating(MEMBER_ID, rating.ratingId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: RATINGS_QUERY_KEY }),
    onError: async (error) => setErrorMessage(await getServerErrorMessage(error)),
  });

  function handleUpdateSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    updateMutation.mutate();
  }

  function handleDelete() {
    if (!window.confirm("이 평점을 삭제할까요?")) return;
    setErrorMessage(null);
    deleteMutation.mutate();
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setScore(String(rating.score));
    setComment(rating.comment ?? "");
    setErrorMessage(null);
  }

  return (
    <li className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900">
          영화 ID {rating.movieId}
        </span>
        {!isEditing && (
          <span className="text-sm font-semibold text-blue-600">
            ★ {rating.score}
          </span>
        )}
      </div>

      {isEditing ? (
        <form className="flex flex-col gap-2" onSubmit={handleUpdateSubmit}>
          <input
            aria-label="별점"
            type="number"
            value={score}
            onChange={(event) => setScore(event.target.value)}
            className={inputClassName}
          />
          <input
            aria-label="한줄평"
            type="text"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            className={inputClassName}
          />
          <div className="flex gap-3 text-sm font-semibold">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="cursor-pointer text-blue-600 disabled:text-gray-400"
            >
              {updateMutation.isPending ? "저장 중..." : "저장"}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="cursor-pointer text-gray-500"
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="m-0 text-sm text-gray-700">{rating.comment}</p>
          <p className="m-0 text-xs text-gray-400">
            {rating.createdAt.replace("T", " ")}
          </p>
          <div className="flex gap-3 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="cursor-pointer text-blue-600"
            >
              수정
            </button>
            <button
              type="button"
              disabled={deleteMutation.isPending}
              onClick={handleDelete}
              className="cursor-pointer text-red-500 disabled:text-gray-400"
            >
              {deleteMutation.isPending ? "삭제 중..." : "삭제"}
            </button>
          </div>
        </>
      )}

      {errorMessage && <p className="m-0 text-xs text-red-500">{errorMessage}</p>}
    </li>
  );
}

function RatingForm() {
  const queryClient = useQueryClient();
  const [movieId, setMovieId] = useState("");
  const [score, setScore] = useState("");
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: () =>
      createRating(MEMBER_ID, {
        movieId: Number(movieId),
        score: Number(score),
        comment: comment.trim() || undefined,
      }),
    onSuccess: () => {
      setMovieId("");
      setScore("");
      setComment("");
      return queryClient.invalidateQueries({ queryKey: RATINGS_QUERY_KEY });
    },
    onError: async (error) => setErrorMessage(await getServerErrorMessage(error)),
  });

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    createMutation.mutate();
  }

  return (
    <form
      className="mb-6 flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4"
      onSubmit={handleSubmit}
    >
      <h3 className="m-0 text-base font-bold text-gray-900">평점 등록</h3>
      <input
        aria-label="영화 ID"
        type="number"
        placeholder="영화 ID"
        value={movieId}
        onChange={(event) => setMovieId(event.target.value)}
        className={inputClassName}
      />
      <input
        aria-label="별점"
        type="number"
        placeholder="별점 (1~5)"
        value={score}
        onChange={(event) => setScore(event.target.value)}
        className={inputClassName}
      />
      <input
        aria-label="한줄평"
        type="text"
        placeholder="한줄평 (선택)"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        className={inputClassName}
      />
      {errorMessage && <p className="m-0 text-xs text-red-500">{errorMessage}</p>}
      <button
        type="submit"
        disabled={createMutation.isPending}
        className="cursor-pointer rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white disabled:cursor-default disabled:bg-gray-400"
      >
        {createMutation.isPending ? "등록 중..." : "등록"}
      </button>
    </form>
  );
}

export function MyPage() {
  const ratingsQuery = useQuery({
    queryKey: RATINGS_QUERY_KEY,
    queryFn: () => getMemberRatings(MEMBER_ID),
  });

  const ratings = ratingsQuery.data ?? [];

  return (
    <main className="flex-1 bg-gray-100 p-4 text-left sm:p-8">
      <h2 className="mb-4 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl">
        {MEMBER_NAME}님의 평점
      </h2>

      <RatingForm />

      {ratingsQuery.isPending ? (
        <p className="py-10 text-center text-gray-500">
          평점을 불러오는 중이에요.
        </p>
      ) : ratingsQuery.isError ? (
        <p className="py-10 text-center text-red-500">
          평점을 불러오지 못했어요.
        </p>
      ) : ratings.length === 0 ? (
        <p className="py-10 text-center text-gray-500">남긴 평점이 없어요.</p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {ratings.map((rating) => (
            <RatingItem key={rating.ratingId} rating={rating} />
          ))}
        </ul>
      )}
    </main>
  );
}
