import { useState } from "react";
import { cn } from "../../utils/cn";

export default function RatingPanel() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [savedRating, setSavedRating] = useState(0);

  function handleSaveRating() {
    if (rating === 0) {
      return;
    }

    setSavedRating(rating);
  }

  return (
    <section>
      <h2 className="text-xl font-bold">
        내 평점
      </h2>

      <p className="mt-2 text-sm text-gray-400">
        별점은 필수, 후기는 선택이에요.
      </p>

      <div
        className="mt-4 flex gap-2"
        role="radiogroup"
        aria-label="영화 평점"
      >
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            role="radio"
            aria-checked={rating === score}
            aria-label={`${score}점`}
            onClick={() => setRating(score)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md border bg-white text-lg",
              score <= rating
                ? "border-gray-500 text-gray-600"
                : "border-gray-200 text-gray-300",
            )}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={review}
        onChange={(event) =>
          setReview(event.target.value)
        }
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        className="mt-4 h-24 w-full resize-none rounded-lg border border-gray-200 bg-white p-4 text-sm outline-none focus:border-blue-500"
      />

      <button
        type="button"
        disabled={rating === 0}
        onClick={handleSaveRating}
        className="mt-3 h-11 w-full rounded-md bg-[#191b20] text-sm font-bold text-white disabled:cursor-default disabled:bg-gray-300"
      >
        평점 저장
      </button>

      <span
        className="sr-only"
        aria-live="polite"
      >
        {savedRating > 0
          ? `${savedRating}점으로 저장되었습니다.`
          : ""}
      </span>
    </section>
  );
}