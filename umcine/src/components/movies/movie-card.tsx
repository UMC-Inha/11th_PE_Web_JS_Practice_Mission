import type {Movie} from "../types/movie";

interface MovieCardProps{
    movie: Movie;
    onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
    movie,
    onToggleBookmark,}: MovieCardProps){
    return (
        <article className="movie-card">
            <div className="poster-wrapper">
                <img className="movie-poster" src={movie.posterPath} alt={movie.title}/>

                <button className="bookmark-button" type="button" onClick={() => onToggleBookmark(movie.id)}
                        aria-pressed={movie.isBookmarked} aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}>
                    {movie.isBookmarked ? <img src="/movie-icons/bookmark.svg"/> : <img src="/movie-icons/bookmark-outline.svg"/>}
                </button>
                <h2 className="movie-title">{movie.title}</h2>
                <p className="movie-release-date">{movie.releaseDate}</p>


            </div>
        </article>
    )
}