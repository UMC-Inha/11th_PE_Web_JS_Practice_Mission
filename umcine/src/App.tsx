import { Header } from "./components/layout/header";
import { Footer } from "./components/layout/footer";
import { MovieGrid } from "./components/movies/movie-grid";

export default function App() {
  return (
    <>
      <Header />
      <MovieGrid />
      <Footer />
    </>
  );
}
