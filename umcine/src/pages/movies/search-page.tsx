import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import styles from "./search-page.module.css";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" }); //useSearch로 검증된 query값을 가져온다.
  const navigate = useNavigate({ from: "/search" }); //검색어를 URL의 search param에 반영한다.
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? ""; //양끝 공백 제거후 소문자로 바꾼다 -> 제목이나 원제에 있는지 확인하기 위한 정규화
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) { //폼제출 이벤트의 타입을 적는다.
    event.preventDefault(); //브라우저의 기본 새로고침을 막고 (->useNavigate)
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  function handleClear() {
    setSearchText("");
    navigate({ search: {} });
  }

  const searchBar = (
    <div className={styles.searchBar}>
      <img src="/icons/search.svg" alt="" className={styles.searchIcon} />
      <input
        aria-label="검색어"
        className={styles.searchInput}
        placeholder="예: 스파이더맨"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
      />
      {searchText && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={handleClear}
        >
          <img src="/icons/close.svg" alt="검색어 지우기" />
        </button>
      )}
    </div>
  );

  if (!normalizedQuery) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <h2 className={styles.emptyHeading}>어떤 영화를 찾고 있나요?</h2>
          <form className={styles.searchBarRow} onSubmit={handleSubmit}>
            {searchBar}
            <button type="submit" className={styles.submitButton}>
              검색
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.resultsState}>
        <h2 className={styles.heading}>영화 검색</h2>

        <form className={styles.searchBarRow} onSubmit={handleSubmit}>
          {searchBar}
          <button type="submit" className={styles.submitButton}>
            다시 검색
          </button>
        </form>

        <div className={styles.resultsHeader}>
          <h3 className={styles.resultsTitle}>'{query}' 검색 결과</h3>
          <p className={styles.resultsCount}>
            영화 {searchResults.length}편 · 1페이지
          </p>
        </div>

        {searchResults.length === 0 ? (
          <p className={styles.emptyResults}>검색 결과가 없어요.</p>
        ) : (
          <ul className={styles.resultList}>
            {searchResults.map((movie) => (
              <li key={movie.id} className={styles.resultItem}>
                <img
                  src={movie.posterPath}
                  alt={`${movie.title} 포스터`}
                  className={styles.resultPoster}
                />
                <div className={styles.resultBody}>
                  <h4 className={styles.resultTitle}>{movie.title}</h4>
                  <p className={styles.resultOriginalTitle}>
                    {movie.originalTitle}
                  </p>
                  <p className={styles.resultDate}>{movie.releaseDate}</p>
                  <p className={styles.resultOverview}>{movie.overview}</p>
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className={styles.resultLink}
                  >
                    상세 보기 →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
