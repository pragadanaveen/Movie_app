/*
Specific movie : used to show single movie details
*/

import { useMatch } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingMovie from "./LoadingMovie";
import Notification from "./Notification";
import axios from "axios";
import { config } from "../config";
import "./SpecificMovie.css";
import { db } from "../db"


const SpecificMovie = () => {
    // getting params
    const Params = useMatch("/movie/:imdbId")
    // getting imdb id
    const imdbId = Params.params.imdbId;

    const [isMovieLoaded, setMovieLoaded] = useState(false);
    const [isMovieAvailable, setMovieAvailable] = useState(true)
    const [warning, setWarning] = useState("")

    // movie details
    const [movie, setMovie] = useState({})

    // Line component to show the line
    // to separate the sections
    const Line = function () {
        return isMovieLoaded && isMovieAvailable ?
            <div className="line-s"></div>
            :
            []
    }

    const req_movie = async () => {
        // request for movie details
        let req = await axios.get(`https://www.omdbapi.com/?i=${imdbId}&apikey=${config.API_KEY}`)
        return req.data;
    }

    const get_full_plot = async () => {
        // getting full plot
        let req = await axios.get(`https://www.omdbapi.com/?i=${imdbId}&apikey=${config.API_KEY}&plot=full`)
        return req.data;
    }

    const set_title = (title) => {
        document.title = title
    }

    const add_movie = (movie) => {
        // add movie to database
        db.get("movies-data")
            .then(data => {
                data.movies[imdbId] = movie
                db.put(data)
            })
            .catch(() => {
                // if doc not found then 
                // create new one
                db.put({
                    _id: "movies-data",
                    movies: {}
                }).then(add_movie)
            })
    }

    const setMovieDetails = async () => {
        // scroll to top
        window.scroll(0, 0)
        try {
            // request for movie details
            let response = await req_movie()

            if (response.Response === "True") {
                // split the Movie Genre
                response.Genre = response?.Genre?.split(",")
                // converting to uppercase
                response.Type = response?.Type?.toUpperCase()

                // getting full plot
                let resp = await get_full_plot();
                response.fullPlot = resp.Plot;

                // setting movie to state
                setMovie(response)
                setMovieAvailable(true)
                setMovieLoaded(true)

                // adding movie
                add_movie(response)

                set_title(response?.Title)

            } else if (response.Response === "False") {
                // API could not find the id
                setMovieAvailable(false)
                setWarning(response.Error)
                setTimeout(() => {
                    setWarning("")
                }, 5500);
            }

        } catch (err) {
            if (err?.code === "ERR_NETWORK") {
                setWarning("Cannot load the movie details from the server.")
            } else {
                setWarning(err.message)
            }

            // getting movie from database
            db.get("movies-data")
                .then(resp => {
                    if (resp?.movies) {
                        if (resp?.movies[imdbId]) {
                            setMovieLoaded(true)
                            setMovie(resp.movies[imdbId])
                            set_title(resp.movies[imdbId]?.Title)

                            setWarning("Cannot load the movie details, using previously fetched data.")
                        }
                    }
                })
                .catch(() => {
                    // if doc is removed or does not exists
                    db.put({
                        _id: "movies-data",
                        movies: {}
                    })
                })

            setTimeout(() => {
                setWarning("")
            }, 3850);

        }
    }

    useEffect(() => {
        // setting movie details
        setMovieDetails()
    }, [])


    return (
        <div>
            {
                isMovieAvailable === true ?
                    <div className="specific-movie">
                        <div className="s-movie">
                            <div className="s-movie-poster">
                                {
                                    isMovieLoaded && movie.Poster ?
                                        movie.Poster !== "N/A" ?
                                            <img src={movie.Poster} alt="Poster" onError={() => {
                                                movie.Poster = "N/A";
                                                setMovie(movie)
                                            }} />
                                            :
                                            <div className='no-poster'>
                                                Poster<br />not<br />found
                                            </div>
                                        :
                                        <LoadingMovie />
                                }
                            </div>
                            <div className="s-movie-text">
                                <div className="s-movie-nm">
                                    {
                                        isMovieLoaded ?
                                            movie.Title
                                            :
                                            <LoadingMovie height={70} width={450} />
                                    }
                                </div>
                                <div className="s-movie-release-year">
                                    {
                                        isMovieLoaded ?
                                            movie.Type + " - "
                                            :
                                            []
                                    }
                                    {
                                        isMovieLoaded && movie.Rated !== "N/A" ?
                                            movie.Rated + " - "
                                            :
                                            []
                                    }
                                    {
                                        isMovieLoaded ?
                                            movie.Year
                                            :
                                            <LoadingMovie height={55} width={130} />
                                    }
                                </div>

                                {
                                    isMovieLoaded ?
                                        <div className="line-s"></div>
                                        :
                                        []
                                }

                                <div className="s-movie-genres">
                                    {
                                        isMovieLoaded && typeof (movie.Genre) ?
                                            movie?.Genre?.map(genre => <div className="s-movie-genre" key={genre}>{genre}</div>)
                                            :
                                            <LoadingMovie height={55} width={200} />
                                    }
                                </div>

                                <Line />

                                <div className="s-movie-plot">
                                    {
                                        isMovieLoaded ?
                                            movie.Plot !== "N/A" ?
                                                <p>{movie.Plot}</p>
                                                :
                                                []
                                            :
                                            <LoadingMovie height={90} width={650} />
                                    }
                                </div>
                            </div>

                            <Line />

                            {
                                isMovieAvailable && isMovieLoaded && movie.fullPlot !== "N/A" ?
                                    <div className="s-movie-plot table">
                                        <header className="i-header">Storyline</header>
                                        <p>{movie.fullPlot}</p>
                                        <Line />
                                    </div>
                                    :
                                    []
                            }

                            {
                                isMovieAvailable && isMovieLoaded ?
                                    <>
                                        <header className="i-header">Movie Details</header>
                                        <div className="movie-details table">
                                            <div className="table">
                                                <div className="t-row">
                                                    <div className="name">Release date</div>
                                                    <div className="val">{movie.Released}</div>
                                                </div>
                                                <div className="t-row">
                                                    <div className="name">Country</div>
                                                    <div className="val">{movie.Country}</div>
                                                </div>
                                                <div className="t-row">
                                                    <div className="name">Language</div>
                                                    <div className="val">{movie.Language}</div>
                                                </div>
                                                <div className="t-row">
                                                    <div className="name">{movie?.Type?.toUpperCase()[0]}{movie?.Type?.toLowerCase().slice(1,)} Runtime</div>
                                                    <div className="val">{movie.Runtime} </div>
                                                </div>
                                                {
                                                    movie.BoxOffice ?
                                                        <div className="t-row">
                                                            <div className="name">Box office collection</div>
                                                            <div className="val">{movie.BoxOffice}</div>
                                                        </div>
                                                        :
                                                        []
                                                }
                                            </div>
                                            <div className="table">
                                                <div className="t-row">
                                                    <div className="name">Director</div>
                                                    <div className="val">{movie.Director}</div>
                                                </div>
                                                <div className="t-row">
                                                    <div className="name">Writers</div>
                                                    <div className="val">{movie.Writer}</div>
                                                </div>
                                                <div className="t-row">
                                                    <div className="name">Stars</div>
                                                    <div className="val">{movie.Actors}</div>
                                                </div>
                                                <div className="t-row">
                                                    <div className="name">Awards</div>
                                                    <div className="val">{movie.Awards}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    []
                            }
                            <Line />
                            {
                                isMovieAvailable && isMovieLoaded ?
                                    <>
                                        <header className="i-header">Ratings</header>
                                        <div className="table">
                                            {
                                                movie?.Ratings?.length > 0 ?
                                                    movie.Ratings.map(rating =>
                                                        <div className="t-row" key={rating.Source}>
                                                            <div className="name">{rating.Source}</div>
                                                            <div className="val">{rating.Value}</div>
                                                        </div>
                                                    )
                                                    :
                                                    <div className="t-row"><b>Movie ratings not available.</b></div>
                                            }
                                        </div>
                                    </>
                                    :
                                    []
                            }
                        </div>
                    </div>
                    :
                    <div className="movie-not-found">
                        <div className="header">
                            Movie not found!
                        </div>
                        <p>Imdb Id in URL is not associated with any movie, please check and enter correct imdb id.</p>
                    </div>
            }
            {
                warning ?
                    <Notification text={warning} />
                    :
                    []
            }
        </div>
    )
}

export default SpecificMovie;