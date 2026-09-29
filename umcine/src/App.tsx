interface MovieCardProps {
  title: string;
  releaseDate: string;
  isBookmarked: boolean;
}

function MovieCard({
  title,
  releaseDate,
  isBookmarked,
}: MovieCardProps) {
  return (
    <article>
      <h2>{title}</h2>
      <p>개봉일: {releaseDate}</p>
      <p>{isBookmarked ? "북마크됨" : "북마크 안 됨"}</p>
    </article>
  );
}

export default function App() {
  return (
    <main>
      <h1>영화 목록</h1>

      <MovieCard
        title="오디세이"
        releaseDate="2026.08.05"
        isBookmarked={true}
      />

      <MovieCard
        title="토이 스토리 5"
        releaseDate="2026.06.17"
        isBookmarked={false}
      />

      <MovieCard
        title="스파이더맨: 노 웨이 홈"
        releaseDate="2021.12.15"
        isBookmarked={false}
      />
    </main>
  );
}