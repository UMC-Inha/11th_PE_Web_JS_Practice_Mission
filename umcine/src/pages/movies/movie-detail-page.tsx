import { Link, useParams } from "@tanstack/react-router";
import { HTTPError } from "ky";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { useBookmarkStore } from "../../stores/bookmark-store";
import type { Movie } from "../../types/movie";
import { getTmdbImageUrl } from "../../utils/movies/tmbd-images";

const RATING_SCORES = [1, 2, 3, 4, 5];

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadMovie() {
      setIsLoading(true);
      setErrorMessage(null);
      setMovie(null);

      try {
        const detail = await getMovieDetail(Number(movieId));
        if (ignore) return;
        setMovie({
          id: detail.id,
          title: detail.title,
          originalTitle: detail.original_title,
          overview: detail.overview,
          tagline: detail.tagline,
          posterPath: getTmdbImageUrl(detail.poster_path),
          backdropPath: getTmdbImageUrl(detail.backdrop_path),
          releaseDate: detail.release_date,
          genres: detail.genres.map((genre) => genre.name),
          runtime: detail.runtime ? `${detail.runtime}분` : "",
        });
      } catch (error) {
        if (ignore) return;
        // 없는 영화 id는 TMDB가 404로 응답하므로 빈 결과로 처리한다.
        if (!(error instanceof HTTPError && error.response.status === 404)) {
          setErrorMessage("영화 정보를 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovie();

    return () => {
      ignore = true;
    };
  }, [movieId]);

  if (isLoading || errorMessage) {
    return (
      <main className="mx-auto max-w-[1440px] px-20 py-24 text-center text-sm text-[#606774]">
        {isLoading ? "영화 정보를 불러오는 중이에요." : errorMessage}
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="mx-auto max-w-[1440px] px-20 py-24 text-center text-[21px] font-bold text-[#17191E]">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return <MovieDetail movie={movie} />;
}

function MovieDetail({ movie }: { movie: Movie }) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movie.id),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const metaItems = [
    movie.releaseDate,
    movie.genres.join(" · "),
    movie.runtime,
  ].filter(Boolean);

  return (
    <>
      {/* div.detail-stage */}
      <div
        className="relative h-[360px] bg-[#17191E] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.45), transparent 60%), url("${movie.backdropPath}"), url("${movie.posterPath}")`,
        }}
      >
        <div className="mx-auto flex h-full max-w-[1440px] flex-col items-start justify-between px-20 py-6">
          <Link
            to="/"
            className="flex items-center gap-1 text-[13px] leading-4 font-bold text-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="size-6"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            영화 목록
          </Link>

          {/* div.detail-copy */}
          <div className="flex w-full max-w-[800px] flex-col items-start gap-2 text-white">
            <h1 className="text-[46px] leading-[50px] font-bold tracking-[-2.3px]">
              {movie.title}
            </h1>
            <p className="text-sm leading-[17px]">{movie.originalTitle}</p>
            <p className="flex items-center gap-2 text-[13px] leading-4 font-bold">
              {metaItems.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </p>
          </div>
        </div>
      </div>

      {/* main.container */}
      <main className="mx-auto flex max-w-[1440px] items-start gap-8 px-20 py-6">
        <div className="h-[286px] w-[200px] shrink-0 overflow-hidden rounded-[10px] bg-[#F6F7F9] shadow-[0_12px_30px_rgba(12,15,20,0.12)]">
          <img
            src={movie.posterPath || undefined}
            alt={`${movie.title} 포스터`}
            className="size-full object-cover"
          />
        </div>

        {/* section.synopsis */}
        <section className="flex min-w-0 flex-1 flex-col items-start gap-3">
          {movie.tagline && (
            <h2 className="text-[21px] leading-[25px] font-bold tracking-[-0.63px] text-[#17191E]">
              {movie.tagline}
            </h2>
          )}
          {movie.overview && (
            <p className="text-sm leading-6 text-[#606774]">{movie.overview}</p>
          )}
          <div className="flex">
            <button
              type="button"
              aria-pressed={isBookmarked}
              onClick={() => toggleBookmark(movie.id)}
              className="flex h-[42px] cursor-pointer items-center justify-center gap-2 rounded-lg border border-white bg-[#2563EB] px-4 text-sm leading-[17px] font-extrabold text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill={isBookmarked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-4"
              >
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
              즐겨찾기
            </button>
          </div>
        </section>

        {/* aside.rating-panel: 평점 저장 기능은 아직 구현하지 않는다. */}
        <aside className="flex w-[360px] shrink-0 flex-col items-stretch gap-2 border-l border-[#E3E6EB] pb-[41px] pl-[30px]">
          <h2 className="text-[21px] leading-[25px] font-bold tracking-[-0.63px] text-[#17191E]">
            내 평점
          </h2>
          <p className="text-xs leading-[14px] text-[#969DA8]">
            별점은 필수, 후기는 선택이에요.
          </p>
          <div aria-label="영화 별점" className="flex gap-1">
            {RATING_SCORES.map((score) => (
              <button
                key={score}
                type="button"
                aria-label={`${score}점`}
                className="flex size-[38px] items-center justify-center rounded-lg border border-[#E3E6EB] bg-white px-1.5 py-px"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="size-6 fill-[#606774]"
                >
                  <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </button>
            ))}
          </div>
          <textarea
            id="review-text"
            aria-label="후기"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="h-[102px] resize-none rounded-lg border border-[#E3E6EB] bg-white px-3 pt-4 pb-[18px] text-[13px] leading-5 text-[#17191E] outline-none placeholder:text-[#969DA8]"
          />
          <button
            id="save-rating"
            type="button"
            className="flex h-[42px] items-center justify-center rounded-lg border border-white bg-[#17191E] px-4 text-sm leading-[17px] font-extrabold text-white"
          >
            평점 저장
          </button>
        </aside>
      </main>
    </>
  );
}
