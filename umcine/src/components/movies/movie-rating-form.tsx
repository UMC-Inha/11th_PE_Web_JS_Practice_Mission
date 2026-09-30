import { useState, type SubmitEvent } from "react";
import { cn } from "../../utils/cn";

const RATING_VALUES = [1, 2, 3, 4, 5];

export function MovieRatingForm() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating === 0) return;
    setIsSaved(true);
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
              setRating(value);
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
          setReview(event.target.value);
          setIsSaved(false);
        }}
        className="mt-2.5 h-[88px] resize-none rounded-lg border border-[#e5e7eb] bg-white p-3 text-xs outline-none placeholder:text-[#9ca3af] focus:border-[#111]"
      />

      <button
        type="submit"
        disabled={rating === 0}
        className="mt-2 h-9 cursor-pointer rounded-md bg-[#111] text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        평점 저장
      </button>

      {isSaved && (
        <p role="status" className="mt-2 text-[11px] text-[#2563EB]">
          평점을 저장했어요.
        </p>
      )}
    </form>
  );
}