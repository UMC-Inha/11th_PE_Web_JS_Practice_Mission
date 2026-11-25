import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import Pagination from "../../components/movies/pagination";
import { MemberProfile } from "../../components/members/member-profile";
import { getFavorites } from "../../api/favorites";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { MemberInfo } from "../../api/members/me";
import { getMemberId } from "../../utils/get-member-id";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function MyPage() {
  return (
    <MemberProfile>
      {(profile, accessToken) => (
        <ProfileView
          key={accessToken}
          profile={profile}
          memberId={getMemberId(accessToken)}
        />
      )}
    </MemberProfile>
  );
}

function ProfileView({
  profile,
  memberId,
}: {
  profile: MemberInfo;
  memberId: string | null;
}) {
  const { nickname, email } = profile;

  return (
    <main className="w-full flex-1 px-5 py-6 xl:px-20">
      <div className="mb-7 flex min-h-[42px] items-center justify-between gap-4">
        <h1 className="text-[28px] leading-[34px] font-bold">내 정보</h1>

        <Link
          to="/mypage/edit"
          className="flex h-[42px] shrink-0 items-center rounded-lg bg-[#2563EB] px-4 text-[13px] font-bold text-white"
        >
          정보 수정
        </Link>
      </div>

      <section
        aria-labelledby="basic-info-title"
        className="border-y border-[#E0E4EA] py-3"
      >
        <h2
          id="basic-info-title"
          className="mb-4 text-base leading-5 font-semibold"
        >
          기본 정보
        </h2>

        <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
          <div className="flex size-[82px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E3E6EA]">
            <img
              src="/icons/person.svg"
              alt="프로필 이미지"
              className="size-12"
            />
          </div>

          <dl className="grid min-w-0 flex-1 gap-5 md:grid-cols-[minmax(0,366px)_minmax(0,1fr)] md:gap-7">
            <div>
              <dt className="text-[11px] leading-4 text-[#98A2B3]">닉네임</dt>

              <dd className="mt-1 break-words text-sm leading-5 font-bold">
                {nickname}
              </dd>
            </div>

            <div>
              <dt className="text-[11px] leading-4 text-[#98A2B3]">이메일</dt>

              <dd className="mt-1 break-all text-sm leading-5 font-bold">
                {email}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <Bookmarks memberId={memberId} />
    </main>
  );
}

function Bookmarks({ memberId }: { memberId: string | null }) {
  const [currentPage, setCurrentPage] = useState(1);

  const favoritesQuery = useQuery({
    queryKey: ["favorites", memberId],
    queryFn: getFavorites,
    enabled: Boolean(memberId),
    retry: false,
  });

  const ids = favoritesQuery.data?.map((favorite) => favorite.movieId) ?? [];

  const totalPages = Math.ceil(ids.length / 5);
  const page = Math.min(currentPage, totalPages || 1);
  const pageIds = ids.slice((page - 1) * 5, page * 5);

  const queries = useQueries({
    queries: pageIds.map((id) => ({
      queryKey: ["movies", "detail", id],
      queryFn: () => getMovieDetail(id),
      staleTime: 60_000,
      retry: false,
    })),
  });

  return (
    <section aria-labelledby="bookmarks-title" className="mt-7">
      <h2
        id="bookmarks-title"
        className="mb-4 text-base leading-5 font-semibold"
      >
        내 즐겨찾기
      </h2>

      {!memberId ? (
        <p role="alert" className="py-10 text-sm text-red-600">
          회원 정보를 확인할 수 없어요. 다시 로그인해 주세요.
        </p>
      ) : favoritesQuery.isPending ? (
        <p role="status" className="py-10 text-sm text-gray-500">
          즐겨찾기를 불러오는 중이에요.
        </p>
      ) : favoritesQuery.isError ? (
        <div role="alert" className="py-10 text-sm text-gray-500">
          <p>즐겨찾기를 불러오지 못했어요.</p>

          <button
            type="button"
            onClick={() => void favoritesQuery.refetch()}
            disabled={favoritesQuery.isFetching}
            className="mt-2 text-blue-600 disabled:opacity-50"
          >
            다시 시도
          </button>
        </div>
      ) : ids.length === 0 ? (
        <p className="py-10 text-sm text-gray-500">
          아직 즐겨찾기한 영화가 없어요.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-[18px] gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {queries.map((query, index) => {
            if (query.isPending) {
              return (
                <p
                  key={pageIds[index]}
                  role="status"
                  className="py-10 text-sm text-gray-500"
                >
                  영화를 불러오는 중이에요.
                </p>
              );
            }

            if (query.isError) {
              return (
                <div
                  key={pageIds[index]}
                  className="py-10 text-sm text-gray-500"
                >
                  <p>영화를 불러오지 못했어요.</p>

                  <button
                    type="button"
                    onClick={() => void query.refetch()}
                    className="mt-2 text-blue-600"
                  >
                    다시 시도
                  </button>
                </div>
              );
            }

            const movie = query.data;
            const poster = getTmdbPosterUrl(movie.poster_path);

            return (
              <article key={movie.id} className="min-w-0">
                <Link
                  to="/movies/$movieId"
                  params={{
                    movieId: String(movie.id),
                  }}
                >
                  {poster ? (
                    <img
                      src={poster}
                      alt={`${movie.title} 포스터`}
                      className="aspect-[241.6/274] w-full rounded-[10px] bg-gray-200 object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[241.6/274] items-center justify-center rounded-[10px] bg-gray-200 text-sm">
                      포스터 없음
                    </div>
                  )}

                  <h3
                    className="mt-2 truncate text-sm leading-[17px] font-bold"
                    title={movie.title}
                  >
                    {movie.title}
                  </h3>
                </Link>

                <p className="mt-1 text-xs leading-[14px] text-[#98A2B3]">
                  {movie.release_date?.replaceAll("-", ".") || "개봉일 미정"}
                </p>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-9 text-sm font-semibold">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
}