import { Footer } from "../../components/layout/footer";
import { MovieGrid } from "../../components/movies/movie-grid";

export function MovieListPage() {
  return (
    <>
      <MovieGrid />
      <Footer />
    </>
  );
}

//Footer가 고정이 아니므로 이렇게 추가해주는 것이 맞는 듯 하다.