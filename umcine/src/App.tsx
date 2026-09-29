export default function App() {
  const movieTitle = "토이 스토리 5";
  const genre = "애니메이션";
  const releaseDate = "2026.06.17";

  return (
    <article className="movie-card">
      <h1>{movieTitle}</h1>
      <p>장르: {genre}</p>
      <p>개봉일: {releaseDate}</p>
    </article>
  );
}