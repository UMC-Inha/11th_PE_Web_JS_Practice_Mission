import {useState} from "react";
import {movies as initialMovies} from "./data/movies";
import MovieGrid from "./components/movie-grid";
import Header from "./components/header";
import Pagination from "./components/pagination.tsx";
import "./App.css";

export default function App(){
    const [movies, setMovies] = useState(initialMovies);

    function handleToggleBookmark(movieId: number){
        setMovies((currentMovies) => currentMovies.map((movie) => movie.id === movieId ? {...movie, isBookmarked: !movie.isBookmarked} : movie));}

        return (
            <>
            <Header />

            <main className="main-content">
                <h1>영화 목록</h1>
                <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark}/>
                <Pagination/>
            </main>
            </>
        );
}