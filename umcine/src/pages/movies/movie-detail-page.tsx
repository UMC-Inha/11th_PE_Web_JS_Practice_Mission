import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { Footer } from "../../components/layout/footer";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const [rating, setRating] = useState(0);

  // TMDB 영화 상세 정보와 요청 상태 관리
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(Number(movieId)),
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  // URL의 영화 ID로 TMDB 상세 정보 요청
  useEffect(() => {
    let ignore = false;

    async function loadMovie() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        setMovie(null);

        const response = await getMovieDetail(Number(movieId));

        if (!ignore) {
          setMovie(response);
        }
      } catch {
        if (!ignore) {
          setErrorMessage("영화 정보를 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadMovie();

    // 이전 요청 결과가 반영되지 않도록 방지
    return () => {
      ignore = true;
    };
  }, [movieId]);

  if (isLoading) {
    return <main className="px-20 py-10">영화 정보를 불러오는 중...</main>;
  }

  if (errorMessage) {
    return (
      <main role="alert" className="px-20 py-10">
        {errorMessage}
      </main>
    );
  }

  if (!movie) {
    return <main className="px-20 py-10">영화를 찾을 수 없어요.</main>;
  }

  // TMDB 이미지 경로를 실제 이미지 URL로 변환
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  // 장르와 상영 시간을 화면에 표시할 문자열로 변환
  const genres = movie.genres.map((genre) => genre.name).join(" · ");
  const runtime = movie.runtime ? `${movie.runtime}분` : "";

  return (
    <div className="flex min-h-[calc(100vh-91px)] flex-col bg-[#f6f7f9]">
      <main className="w-full flex-1">
        <section className="relative h-[360px] w-full overflow-hidden bg-[#17191e]">
          {backdropUrl && (
            <img
              src={backdropUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-black/50" />

          <div className="relative z-10 h-full px-20 py-6 text-white">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-[13px] font-bold text-white"
            >
              <img
                src="/icons/chevron-left.svg"
                alt=""
                className="h-6 w-6 brightness-0 invert"
              />
              <span>영화 목록</span>
            </Link>

            <div className="absolute bottom-6 left-20">
              <h1 className="text-[46px] font-bold leading-[50px] tracking-[-2.3px]">
                {movie.title}
              </h1>

              <p className="mt-2 text-sm">
                {movie.original_title}
              </p>

              <div className="mt-2 flex items-center gap-2 text-[13px] font-bold">
                <span>{movie.release_date}</span>
                <span>{genres}</span>
                <span>{runtime}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex w-full items-start gap-8 bg-[#f6f7f9] px-20 py-6">
          {/* 포스터 */}
          <div className="h-[286px] w-[200px] shrink-0 overflow-hidden rounded-[10px] bg-[#e3e6eb] shadow-[0_12px_30px_rgba(12,15,20,0.12)]">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={`${movie.title} 포스터`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-[#606774]">
                포스터 없음
              </div>
            )}
          </div>

          {/* 줄거리 */}
          <section className="flex flex-1 flex-col gap-3">
            <h2 className="text-[21px] font-bold tracking-[-0.63px] text-[#17191e]">
              {movie.tagline || movie.title}
            </h2>

            <p className="text-sm leading-6 text-[#606774]">
              {movie.overview || "등록된 줄거리가 없어요."}
            </p>

            <button
              type="button"
              onClick={() => toggleBookmark(movie.id)}
              aria-pressed={isBookmarked}
              className="flex h-[42px] w-fit items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-4 text-sm font-extrabold text-white"
            >
              <img
                src={
                  isBookmarked
                    ? "/icons/bookmark.svg"
                    : "/icons/bookmark-outline.svg"
                }
                alt=""
                className="h-5 w-5 brightness-0 invert"
              />
              즐겨찾기
            </button>
          </section>

          {/* 내 평점 */}
          <aside className="flex w-[360px] shrink-0 flex-col gap-2 border-l border-[#e3e6eb] pb-[41px] pl-[30px]">
            <h2 className="text-[21px] font-bold tracking-[-0.63px] text-[#17191e]">
              내 평점
            </h2>

            <p className="text-xs text-[#969da8]">
              별점은 필수, 후기는 선택이에요.
            </p>

            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  aria-label={`${score}점`}
                  onClick={() => setRating(score)}
                  className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-lg border border-[#e3e6eb] bg-white"
                >
                  <img
                    src={
                      score <= rating
                        ? "/icons/star.svg"
                        : "/icons/star-outline.svg"
                    }
                    alt=""
                    className="h-6 w-6"
                  />
                </button>
              ))}
            </div>

            <textarea
              placeholder="영화를 보고 느낀 점을 남겨보세요."
              className="h-[102px] w-full resize-none rounded-lg border border-[#e3e6eb] bg-white px-3 py-4 text-[13px] outline-none placeholder:text-[#969da8]"
            />

            <button
              type="button"
              className="h-[42px] w-full rounded-lg bg-[#17191e] text-sm font-extrabold text-white"
            >
              평점 저장
            </button>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}