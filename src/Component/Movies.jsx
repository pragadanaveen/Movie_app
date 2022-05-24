/*
Shows collection of movies

mainly used in Search Component
*/

import LoadingMovie from "./LoadingMovie";
import Movie from "./Movie";
import "./Movies.css"

const Movies = ({ movieList, searching }) => {
    return (
        <div id="movies">
            {
                searching === true ?
                [1,2,3,4].map(index => <LoadingMovie key={index} />)
                :
                movieList?.length > 0
                ?
                movieList?.map(movie => <Movie movie={movie} key={movieList.indexOf(movie)} />)
                :
                []
            }
        </div>
    )
}

export default Movies;