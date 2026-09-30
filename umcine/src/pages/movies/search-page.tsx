import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

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

  return (
    <main>
      <h1>영화 검색</h1>
      <form onSubmit={handleSubmit}>
        <input
          aria-label="검색어"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <button type="submit">검색</button>
      </form>

      {!normalizedQuery ? (
        <p>검색어를 입력해 주세요.</p>
      ) : (
        <>
          <h2>‘{query}’ 검색 결과</h2>
          <p>영화 {searchResults.length}편</p>
          {searchResults.length === 0 ? (
            <p>검색 결과가 없어요.</p>
          ) : (
            <ul>
              {searchResults.map((movie) => (
                <li key={movie.id}>
                  <img src={movie.posterPath} alt={`${movie.title} 포스터`} />
                  <h3>{movie.title}</h3>
                  <p>{movie.originalTitle}</p>
                  <p>{movie.releaseDate}</p>
                  <p>{movie.overview}</p>
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                  >
                    상세 보기
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}