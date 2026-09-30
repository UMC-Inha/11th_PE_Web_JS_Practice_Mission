import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import styles from "./movie-detail-page.module.css";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" }); //path param을 가져와 영화를 찾고 아래서 상세 정보 표시
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return <main className={styles.notFound}>영화를 찾을 수 없어요.</main>;
  }

  return (
    <main>
      <div
        className={styles.hero}
        style={{ backgroundImage: `url(${movie.backdropPath})` }}
      >
        <Link to="/" className={styles.backLink}>
          <img src="/icons/chevron-left.svg" alt="" />
          영화 목록
        </Link>

        <div className={styles.heroInfo}>
          <h1 className={styles.title}>{movie.title}</h1>
          <p className={styles.originalTitle}>{movie.originalTitle}</p>
          <p className={styles.meta}>
            <span>{movie.releaseDate}</span>
            <span>{movie.genres.join(" · ")}</span>
            <span>{movie.runtime}</span>
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.posterColumn}>
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className={styles.poster}
          />
        </div>

        <div className={styles.infoColumn}>
          <h2 className={styles.tagline}>{movie.tagline}</h2>
          <p className={styles.overview}>{movie.overview}</p>
          <button type="button" className={styles.bookmarkButton}>
            <img src="/icons/bookmark-outline.svg" alt="" />
            즐겨찾기
          </button>
        </div>

        <div className={styles.ratingColumn}>
          <h2 className={styles.ratingTitle}>내 평점</h2>
          <p className={styles.ratingHint}>별점은 필수, 후기는 선택이에요.</p>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((n) => (
              <img key={n} src="/icons/star-outline.svg" alt={`${n}점`} />
            ))}
          </div>
          <textarea
            className={styles.reviewInput}
            placeholder="영화를 보고 느낀 점을 남겨보세요."
          />
          <button type="button" className={styles.saveButton}>
            평점 저장
          </button>
        </div>
      </div>
    </main>
  );
}
