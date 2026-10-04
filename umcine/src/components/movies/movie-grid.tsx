import { useEffect, useState } from "react";
import { movies as initialMovies } from "../../data/movies";
import { readBookmarkIds, saveBookmarkIds } from "../../utils/bookmark-storage";
import { MovieCard } from "./movie-card";
import { Pagination } from "./pagination";
import styles from "./movie-grid.module.css";

export function MovieGrid() {
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(() =>
    readBookmarkIds()
  );
  //처음에 한 번만 localStorage에서 북마크된 영화 ID를 읽어와서 상태 초기값으로 설정

  useEffect(() => {
    saveBookmarkIds(bookmarkedIds);
    // bookmarkedIds가 바뀔 때마다(=북마크를 추가/해제할 때마다) localStorage에 다시 써서
    // 새로고침해도 북마크 상태가 유지되게 함. 렌더링 중이 아니라 화면에 그려진 "다음"에 실행됨.
  }, [bookmarkedIds]);

  const movies = initialMovies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarkedIds.includes(movie.id),
  }));
  // initialMovies(고정된 영화 10개 전체 데이터)는 state가 아니라 그냥 import한 값.
  // 실제로 바뀌는 건 "어떤 id가 북마크됐는지"뿐이라 그 부분(bookmarkedIds)만 state로 두고,
  // 렌더링할 때마다 initialMovies와 합쳐서 각 영화의 isBookmarked만 덮어쓴 새 배열을 만든다.
  // (movies 자체는 state가 아니라 매 렌더마다 다시 계산되는 파생 값)

  const handleToggleBookmark = (movieId: number) => {
    setBookmarkedIds((prevIds) =>
      // 이미 배열에 있으면 제거(filter), 없으면 추가([...prev, id])
      prevIds.includes(movieId)
        ? prevIds.filter((id) => id !== movieId)
        : [...prevIds, movieId]
    );
  };

  /*
  localStorage 연동 전: 북마크 id 배열이 아니라 영화 객체 배열 자체를 state로 들고 있던 버전.
  새로고침하면 북마크 상태가 전부 초기화됐음.

  const [movies, setMovies] = useState(initialMovies);
  const handleToggleBookmark = (movieId: number) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie
      )
    );
  };
  */

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>영화 목록</h2>

      <div className={styles.grid}>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onToggleBookmark={handleToggleBookmark}
          />
        ))}
      </div>

      <Pagination />
    </section>
  );
}
