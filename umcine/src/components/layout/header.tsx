export default function Header(){
    return(
        <header className="header">
            <div className="header-inner">
                <div className="header-left">
                <strong className="logo"> <img className="logo" src="/movie-icons/movie.svg" alt="UMCine"/>UMCine</strong>

                <nav className="header-nav">
                    <span>영화</span>
                    <span>검색</span>
                    <span>내 정보</span>
                </nav>
            </div>

                <div className="header-right">
                    <button className="search-button" aria-label="검색"><img src="/movie-icons/search.svg"/></button>
                    <button className="login-button">로그인</button>
                </div>
            </div>


        </header>
    )
}