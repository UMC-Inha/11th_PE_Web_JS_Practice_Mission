import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "../pages/movies/search-page";

export const Route = createFileRoute("/search")({
  validateSearch: (search): { query?: string; page?: number } => ({
    query: typeof search.query === "string" ? search.query : undefined,
    page:
      typeof search.page === "number" && Number.isInteger(search.page) && search.page > 0
        ? search.page
        : undefined,
  }),
  component: SearchPage,
});
