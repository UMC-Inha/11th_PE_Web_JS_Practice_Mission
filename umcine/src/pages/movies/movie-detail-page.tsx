import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage(){
    const {movieId} = useParams({from: "/movies/$movieId"});
    const movie = movies.find((item) => item.id===Number(movieId));

    if (!movie){
        return <main>영화를 찾을 수 없어요.</main>;
    }
    
  return (
    <main className="min-h-screen">
        <section className="relative h-[370px] overflow-hidden">
            <img src={movie.backdropPath} alt="" aria-hidden="true" 
            className="absolute inset-0 h-full w-full object-cover"
            />
            <Link to="/"
            className="absolute left-[80px] top-[24px] z-10 flex items-center gap-2 text-[13px] font-bold text-white"
            ><span>‹</span>영화 목록</Link>
            <div className="absolute bottom-[24px] left-[80px] z-10 text-white">
                <h1 className="text-[46px] font-bold tracking-[-2.3px]">
                    {movie.title}
                </h1>
                <p className="mb-[8px] mt-[8px] text-[14px]">
                    {movie.originalTitle}
                </p>
                <div className="flex flex-wrap gap-[8px] text-[13px] font-bold">
                    <span>{movie.releaseDate}</span>
                    <span>{movie.genres.join(" · ")}</span>
                    <span>{movie.runtime}</span>
                </div>
            </div>
        </section>
        <section className="mx-auto flex w-full max-w-[1320px] gap-8 px-6 py-7 ">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="h-[286px] w-[200px] rounded-[10px] object-cover"
        />
        <div className="min-w-0 flex-1">
          <h2 className="mb-[12px] text-[21px] font-bold tracking-[-1.7px]">
            {movie.tagline}
          </h2>
          <p className="max-w-656px] text-[14px] leading-[24px] text-[#606774]">
            {movie.overview}
          </p>
        </div>
      </section>
    </main>
  );
}