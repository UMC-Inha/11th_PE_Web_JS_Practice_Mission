import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" }); //path param을 가져와 영화를 찾고 아래서 상세 정보 표시
  const movie = movies.find((item) => item.id === Number(movieId)); 

  if (!movie) {
    return <main>영화를 찾을 수 없어요.</main>;
  }

  return (
    <main>
      <img src={movie.backdropPath} alt="" aria-hidden="true" /> //장식용 배경 이미지 alt를 비워 스크린 리더가 같은 영화 정보 반복해서 읽지 않게 함
      <Link to="/">영화 목록</Link>
      <img src={movie.posterPath} alt={`${movie.title} 포스터`} />
      <h1>{movie.title}</h1>
      <p>{movie.originalTitle}</p>
      <p>{movie.releaseDate}</p>
      <p>{movie.genres.join(" · ")}</p>
      <p>{movie.runtime}</p>
      <h2>{movie.tagline}</h2>
      <p>{movie.overview}</p>
    </main>
  );
}