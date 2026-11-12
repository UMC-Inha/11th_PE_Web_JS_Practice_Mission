import { useQueries } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { ProfileAvatar } from "../../components/me/profile-avatar";
import { Pagination } from "../../components/movies/pagination";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { useProfileStore } from "../../stores/profile-store";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

const PAGE_SIZE = 10;

export function MyInfoPage() {
  const { nickname, email, profileImage } = useProfileStore();
  const bookmarkedMovieIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(bookmarkedMovieIds.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageMovieIds = bookmarkedMovieIds.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const movieQueries = useQueries({
    queries: pageMovieIds.map((movieId) => ({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
    })),
  });

  return (
    <main className="flex flex-1 flex-col bg-gray-100 p-4 text-left sm:p-8">
      <div className="flex items-center justify-between border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">내 정보</h1>
        <Link
          to="/me/edit"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white no-underline"
        >
          정보 수정
        </Link>
      </div>

      <section className="border-b border-gray-200 py-6">
        <h2 className="mb-4 text-lg font-bold text-gray-900">기본 정보</h2>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <ProfileAvatar imageUrl={profileImage} />
          <div className="w-52">
            <p className="m-0 text-xs text-gray-400">닉네임</p>
            <p className="m-0 mt-1 font-bold text-gray-900">{nickname}</p>
          </div>
          <div>
            <p className="m-0 text-xs text-gray-400">이메일</p>
            <p className="m-0 mt-1 font-bold text-gray-900">{email}</p>
          </div>
        </div>
      </section>

      <section className="py-6">
        <h2 className="mb-4 text-lg font-bold text-gray-900">내 즐겨찾기</h2>

        {bookmarkedMovieIds.length === 0 ? (
          <p className="py-10 text-center text-gray-500">
            즐겨찾기한 영화가 없어요.
          </p>
        ) : (
          <>
            <ul className="m-0 grid list-none grid-cols-2 gap-5 p-0 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {movieQueries.map((movieQuery, index) => {
                const movieId = pageMovieIds[index];

                if (movieQuery.isPending) {
                  return (
                    <li
                      key={movieId}
                      className="flex aspect-[268/304] items-center justify-center rounded-xl bg-gray-200 text-sm text-gray-500"
                    >
                      불러오는 중이에요.
                    </li>
                  );
                }

                if (movieQuery.isError) {
                  return (
                    <li
                      key={movieId}
                      className="flex aspect-[268/304] items-center justify-center rounded-xl bg-gray-200 text-sm text-red-500"
                    >
                      불러오지 못했어요.
                    </li>
                  );
                }

                const movie = movieQuery.data;
                const posterUrl = getTmdbPosterUrl(movie.poster_path);

                return (
                  <li key={movieId}>
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movieId) }}
                      className="block no-underline"
                    >
                      {posterUrl ? (
                        <img
                          src={posterUrl}
                          alt={`${movie.title} 포스터`}
                          className="aspect-[268/304] w-full rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex aspect-[268/304] w-full items-center justify-center rounded-xl bg-gray-200 text-sm text-gray-500">
                          이미지 없음
                        </div>
                      )}
                      <h3 className="mt-2 text-[15px] font-bold text-gray-900">
                        {movie.title}
                      </h3>
                      <p className="m-0 text-[13px] text-gray-400">
                        {movie.release_date.replace(/-/g, ".")}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </main>
  );
}
