import { useState, type SubmitEvent } from "react";

interface Review {
  rating: number;
  comment: string;
}

function readReview(movieId: number): Review {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(`umcine-review-${movieId}`) ?? "null");
    if (stored && typeof stored === "object" && "rating" in stored && "comment" in stored
      && typeof stored.rating === "number" && Number.isInteger(stored.rating)
      && stored.rating >= 1 && stored.rating <= 5 && typeof stored.comment === "string") {
      return { rating: stored.rating, comment: stored.comment };
    }
  } catch {
    // 저장된 평점이 잘못된 경우 빈 입력으로 시작해요.
  }
  return { rating: 0, comment: "" };
}

export function MovieReview({ movieId }: { movieId: number }) {
  const [review, setReview] = useState(() => readReview(movieId));
  const [message, setMessage] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (review.rating === 0) {
      setMessage("별점을 선택해 주세요.");
      return;
    }
    try {
      localStorage.setItem(`umcine-review-${movieId}`, JSON.stringify(review));
      setMessage("평점을 저장했어요.");
    } catch {
      setMessage("평점을 저장하지 못했어요. 다시 시도해 주세요.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-[#e2e5eb] pt-6 lg:border-l lg:border-t-0 lg:pl-[30px] lg:pt-0">
      <h2 className="text-[21px] font-bold tracking-[-1px]">내 평점</h2>
      <p className="mb-2 mt-2 text-xs text-[#969DA8]">별점은 필수, 후기는 선택이에요.</p>
      <div role="group" aria-label="별점 선택" className="mb-2 flex gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            aria-label={`${rating}점`}
            aria-pressed={review.rating === rating}
            onClick={() => {
              setReview((current) => ({ ...current, rating }));
              setMessage("");
            }}
            className="grid h-[38px] w-[38px] place-items-center rounded-[8px] border border-[#e2e5eb] bg-white"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className={`h-6 w-6 ${rating <= review.rating ? "text-blue-600" : "text-[#6b7280]"}`} fill="currentColor">
              <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
            </svg>
          </button>
        ))}
      </div>
      <textarea
        aria-label="영화 후기"
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        value={review.comment}
        onChange={(event) => {
          setReview((current) => ({ ...current, comment: event.target.value }));
          setMessage("");
        }}
        className="block h-[102px] w-full resize-none rounded-[8px] border border-[#e2e5eb] bg-white p-3 text-sm leading-6 outline-none placeholder:text-[#969DA8] focus:border-blue-600"
      />
      <button type="submit" className="mt-2 h-10 w-full rounded-[8px] bg-[#17191e] text-sm font-bold text-white">평점 저장</button>
      <p role="status" className="mt-2 min-h-5 text-xs text-[#606774]">{message}</p>
    </form>
  );
}

