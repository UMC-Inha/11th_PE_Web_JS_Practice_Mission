import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { useMemberProfile } from "../../hooks/use-member-profile";
import { ProfileStatus } from "../../components/auth/profile-status";
import { useFavoritesQuery } from "../../hooks/use-favorites-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import MovieCard from "../../components/movies/movie-card";
import Pagination from "../../components/movies/pagination";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { useMyRatings } from "../../hooks/use-my-ratings";

function MyRatings() {
  const ratings = useMyRatings();

  if (ratings.isPending) return <div aria-busy="true" className="h-24 animate-pulse rounded-lg bg-gray-100" />;
  if (ratings.isError) return <p role="alert" className="text-sm text-gray-500">내 평점을 불러오지 못했어요. <button type="button" className="text-blue-600" onClick={() => void ratings.refetch()}>다시 시도</button></p>;
  if (ratings.data.length === 0) return <p className="text-sm text-gray-500">아직 등록한 평점이 없어요.</p>;

  return <ul className="space-y-3">{ratings.data.map((rating) => <li key={rating.ratingId} className="rounded-lg border border-[#e2e5eb] p-4">
    <Link to="/movies/$movieId" params={{ movieId: String(rating.movieId) }} className="font-bold text-blue-600">영화 #{rating.movieId}</Link>
    <span className="ml-3 text-sm">{rating.score}점</span>
    {rating.comment && <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">{rating.comment}</p>}
  </li>)}</ul>;
}

function BookmarkedMovies() {
  const favoritesQuery = useFavoritesQuery();
  const ids = favoritesQuery.data?.map((favorite) => favorite.movieId) ?? [];
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(ids.length / 5);
  const currentPage = Math.min(page, Math.max(1, totalPages));
  const movies = useQueries({ queries: ids.slice((currentPage - 1) * 5, currentPage * 5).map((id) => ({
    queryKey: ["movies", "bookmark-detail", id], queryFn: () => getMovieDetail(id),
  })) });
  if (favoritesQuery.isError) return <div className="py-20 text-center text-sm text-[#969da8]">
    <p role="alert">즐겨찾기를 불러오지 못했어요.</p>
    <button type="button" onClick={() => void favoritesQuery.refetch()} className="mt-3 text-blue-600">다시 시도</button>
  </div>;
  if (favoritesQuery.isPending) return <div aria-busy="true" className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-5">
    {Array.from({ length: 5 }, (_, index) => <div key={index} aria-hidden="true" className="h-[274px] animate-pulse rounded-lg bg-gray-100" />)}
  </div>;
  if (ids.length === 0) return <div className="py-20 text-center text-sm text-[#969da8]">아직 즐겨찾기한 영화가 없어요. <Link to="/" className="text-blue-600">영화 둘러보기</Link></div>;
  return <>
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-5">
      {movies.map((query, index) => query.data ? <MovieCard key={query.data.id} movie={{ id: query.data.id, title: query.data.title, posterPath: getTmdbPosterUrl(query.data.poster_path), releaseDate: query.data.release_date }} /> :
        <div key={ids[(currentPage - 1) * 5 + index]} className="flex h-[274px] items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-500" role={query.isError ? "alert" : "status"}>
          {query.isError ? <button type="button" onClick={() => void query.refetch()}>불러오기 실패 · 다시 시도</button> : <span aria-hidden="true" className="h-full w-full animate-pulse rounded-lg bg-gray-100" />}
        </div>)}
    </div>
    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
  </>;
}

export function ProfilePage() {
  const profile = useMemberProfile();
  return (
    <main className="mx-auto w-full max-w-[1440px] px-[5.5%] py-8">
      <div className="mb-6 flex items-center justify-between border-b border-[#e2e5eb] pb-6">
        <h1 className="text-[28px] font-bold">내 정보</h1>
        <Link to="/me/edit" className="account-primary inline-flex items-center">정보 수정</Link>
      </div>
      {!profile.data || profile.isError ? <ProfileStatus isError={profile.isError} onRetry={() => void profile.refetch()} /> : <>
        <section className="border-b border-[#e2e5eb] pb-6" aria-labelledby="basic-info">
          <h2 id="basic-info" className="mb-4 font-bold">기본 정보</h2>
          <div className="flex items-center gap-7 max-sm:items-start">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-[#e2e5eb]"><img src="/icons/person.svg" alt="기본 프로필" className="h-10 w-10" /></div>
            <dl className="grid flex-1 gap-6 sm:grid-cols-3">
              <div><dt className="mb-1 text-xs text-[#969da8]">닉네임</dt><dd className="break-all text-sm font-bold">{profile.data.nickname}</dd></div>
              <div><dt className="mb-1 text-xs text-[#969da8]">이메일</dt><dd className="break-all text-sm font-bold">{profile.data.email}</dd></div>
              <div>
                <dt className="mb-1 text-xs text-[#969da8]">가입일</dt>
                <dd className="text-sm">{profile.data.createdAt?.split("T")[0] || "—"}</dd>
              </div>
            </dl>
          </div>
        </section>
        <section className="pt-6" aria-labelledby="bookmarks-title"><h2 id="bookmarks-title" className="mb-4 font-bold">내 즐겨찾기</h2><BookmarkedMovies /></section>
        <section className="mt-8 border-t border-[#e2e5eb] pt-6" aria-labelledby="ratings-title"><h2 id="ratings-title" className="mb-4 font-bold">내 평점</h2><MyRatings /></section>
      </>}
    </main>
  );
}
