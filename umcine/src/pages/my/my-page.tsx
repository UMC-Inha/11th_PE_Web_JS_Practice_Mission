import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { UserIcon } from "../../components/icons";
import Pagination from "../../components/movies/pagination";
import { DUMMY_MY_INFO } from "../../data/my-info";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

const BOOKMARKS_PER_PAGE = 10;

export function MyPage() {
  const [page, setPage] = useState(1);
  const bookmarkedMovieIds = useBookmarkStore((state) => state.bookmarkedMovieIds);

  // 최근에 북마크한 영화가 앞에 오도록 뒤집고, 지금 페이지 몫만 자르기
  const latestFirstIds = [...bookmarkedMovieIds].reverse();
  const totalPages = Math.ceil(latestFirstIds.length / BOOKMARKS_PER_PAGE);
  const pageMovieIds = latestFirstIds.slice(
    (page - 1) * BOOKMARKS_PER_PAGE,
    page * BOOKMARKS_PER_PAGE,
  );

  // 상세 화면과 같은 queryKey라서 이미 본 영화는 캐시에서 바로 나옴
  const movieQueries = useQueries({
    queries: pageMovieIds.map((movieId) => ({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
      staleTime: 30 * 1000,
    })),
  });

  return (
    <main className="mx-auto w-full max-w-360 flex-1 px-20 py-12">
      <div className="flex items-center justify-between border-b border-gray-200 pb-6">
        <h1 className="text-[32px] font-bold">내 정보</h1>
        <Link
          to="/my/edit"
          className="rounded-lg bg-[#4f5de8] px-4 py-2 text-sm font-semibold text-white"
        >
          정보 수정
        </Link>
      </div>

      <section className="border-b border-gray-200 py-6">
        <h2 className="mb-4 text-base font-bold">기본 정보</h2>
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-800">
            <UserIcon className="h-8 w-8" />
          </div>
          <dl className="grid flex-1 grid-cols-2 gap-6">
            <div>
              <dt className="text-xs text-gray-400">닉네임</dt>
              <dd className="mt-1 text-sm font-semibold">{DUMMY_MY_INFO.nickname}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">이메일</dt>
              <dd className="mt-1 text-sm font-semibold">{DUMMY_MY_INFO.email}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="py-6">
        <h2 className="mb-4 text-base font-bold">내 북마크</h2>

        {pageMovieIds.length === 0 ? (
          <p className="py-24 text-center text-sm text-gray-500">아직 북마크한 영화가 없어요.</p>
        ) : (
          <ul className="grid grid-cols-5 gap-6">
            {movieQueries.map((movieQuery, index) => {
              const movieId = pageMovieIds[index];
              const movie = movieQuery.data;

              // 아직 불러오는 중이면 같은 크기의 회색 칸
              if (!movie) {
                return <li key={movieId} className="aspect-2/3 rounded-lg bg-gray-200" />;
              }

              const posterUrl = getTmdbPosterUrl(movie.poster_path);

              return (
                <li key={movieId}>
                  <Link to="/movies/$movieId" params={{ movieId: String(movieId) }} className="block">
                    <div className="aspect-2/3 overflow-hidden rounded-lg bg-gray-200">
                      {posterUrl && (
                        <img src={posterUrl} alt={movie.title} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <p className="mt-2 truncate text-sm font-semibold">{movie.title}</p>
                    <p className="text-xs text-gray-400">{movie.release_date.replaceAll("-", ".")}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {totalPages > 0 && (
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </section>
    </main>
  );
}