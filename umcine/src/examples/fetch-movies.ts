import { getMoviesWithFetch } from "../api/movies/get-movies-with-fetch";

getMoviesWithFetch()
  .then((response) => {
    console.log("순수 fetch 인기 영화 응답", response);
  })
  .catch((error: unknown) => {
    console.error(error);
  });
