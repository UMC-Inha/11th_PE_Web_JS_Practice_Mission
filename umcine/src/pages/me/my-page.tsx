import { useEffect, useState } from "react";
import { getMemberRatings } from "../../api/members/get-member-ratings";
import type { MemberRating } from "../../api/members/get-member-ratings";

const MEMBER_ID = 1;
const MEMBER_NAME = "수현";

export function MyPage() {
  const [ratings, setRatings] = useState<MemberRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    setIsLoading(true);
    setErrorMessage(null);

    getMemberRatings(MEMBER_ID)
      .then((response) => {
        if (!ignore) setRatings(response);
      })
      .catch(() => {
        if (!ignore) setErrorMessage("평점을 불러오지 못했어요.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  let content;
  if (isLoading) {
    content = <p className="py-10 text-center text-gray-500">평점을 불러오는 중이에요.</p>;
  } else if (errorMessage) {
    content = <p className="py-10 text-center text-red-500">{errorMessage}</p>;
  } else if (ratings.length === 0) {
    content = <p className="py-10 text-center text-gray-500">남긴 평점이 없어요.</p>;
  } else {
    content = (
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {ratings.map((rating) => (
          <li
            key={rating.ratingId}
            className="flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">
                영화 ID {rating.movieId}
              </span>
              <span className="text-sm font-semibold text-blue-600">
                ★ {rating.score}
              </span>
            </div>
            <p className="m-0 text-sm text-gray-700">{rating.comment}</p>
            <p className="m-0 text-xs text-gray-400">
              {rating.createdAt.replace("T", " ")}
            </p>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <main className="flex-1 bg-gray-100 p-4 text-left sm:p-8">
      <h2 className="mb-4 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl">
        {MEMBER_NAME}님의 평점
      </h2>
      {content}
    </main>
  );
}
