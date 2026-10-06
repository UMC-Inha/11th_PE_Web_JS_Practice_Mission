import { createFileRoute } from "@tanstack/react-router";
import { MovieListPage } from "../pages/movies/movie-list-page.tsx";

export const Route = createFileRoute("/")({
  component: MovieListPage,
});