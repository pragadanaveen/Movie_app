/*
Used to display movie in small format
or MovieCard that display Movie Poster, type, title and released year
*/

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Movie.css'

const Movie = ({movie}) => {
    const [moviePoster, setMoviePoster] = useState(movie.Poster)
    const imdbId = movie.imdbID;
    const navigate = useNavigate();

    return (
        <div className="movie-series-card" onClick={()=>{
            // when clicked on movie card
            // navigate to specific movie
            return navigate(
                {
                    pathname: `/movie/${imdbId}`,
                },
                
            )
        }}>
            
            {
                moviePoster !== "N/A" ?
                // if Poster not loaded then automatically sets N/A 
                // if moviePoster is "N/A" then "Poster not found" will be used
                <img src={movie.Poster} alt="Poster" onError={()=>setMoviePoster("N/A")} />
                :
                <div className='no-poster'>
                    Poster
                    <br />
                    not
                    <br />
                    found
                </div>
            }
            <div className="type">{movie.Type.toUpperCase()}</div>
            {/* used substring method in title to maintain the same height of all cards when shown. */}
            <div className="title">{movie.Title.substring(0,33)}{movie.Title.length > 33 ? "..." : []}</div>
            <div className="year">{movie.Year}</div>
        </div>
    )
}

export default Movie;