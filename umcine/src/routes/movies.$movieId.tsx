import { createFileRoute } from "@tanstack/react-router";
import { MovieDetailPage } from "../pages/movies/movie-detail-page";

export const Route = createFileRoute("/movies/$movieId")({// /movies/2 의 2처럼 path안에서 달라지는 값=path param
  component: MovieDetailPage,
});