import { createFileRoute } from "@tanstack/react-router";
import { MovieDetailPage } from "../screens/movies/movie-detail-page";

export const Route = createFileRoute("/movies/$movieId")({
    component: MovieDetailPage,
})