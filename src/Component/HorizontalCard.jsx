/*
HorizontalCard shows the movies in horizontal format

It only loads first page ( first 10 items ) from the list and shows the 'load more' button that redirects
to the search component for more items
*/

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { config } from "../config";
import Movie from "./Movie";
import "./HorizontalCard.css"
import { useNavigate } from "react-router-dom";
import LoadingMovie from "./LoadingMovie";
import * as Bootstrap from "react-icons/bs"
import Notification from "./Notification";
import { db } from "../db";

const HorizontalCard = ({ searchItem }) => {
    // used to redirect to search component
    // by updating parameters
    const navigate = useNavigate();

    // scrolls to ref when movies loaded
    const MovieCard = useRef();

    // all items collection
    const [movies, setMovies] = useState([]);
    // if not found
    const [notFound, setNotFound] = useState(false);
    // any error occured
    const [error, setError] = useState("");
    // scrolling of horizontal card 
    const [scrolledPercentage, setScrolledPercentage] = useState(0);

    useEffect(() => {
        // if movies are loaded and updated in database then it will be loaded and shown
        db.get(`Horizontal-Movie-Card-${searchItem}`)
            .then(resp => {
                let movies = resp?.movieList;
                let moviesData;
                if (movies?.length > 0) {
                    for (var i = 0; i < movies?.length; i++) {
                        if (movies[i]?.page === 1) {
                            moviesData = movies[i].list;
                            break;
                        }
                    }
                }
                if (moviesData) {
                    setMovies(moviesData)
                }
            })
            .catch(() => {
                // no need to create new doc
            })

        // first time or movies in database both time this request will run thus content on the page can be updated
        // by replacing old information if any
        axios.get(`https://www.omdbapi.com/?s=${searchItem}&apikey=${config.API_KEY}&page=${1}`)
            .then(d => d.data)
            .then(resp => {
                // if response is True
                // note :- it's string not boolean
                if (resp.Response === "True") {
                    // setting fetched items to movies
                    setMovies(resp.Search)

                    // adding fetched data to database
                    // this will be shown when user is not connected to the internet or if connection is slow
                    // then this data will shown first, axios request will run in background
                    db.get(`Horizontal-Movie-Card-${searchItem}`)
                    .then(response => {
                        response.movieList = [
                            {
                                page : 1,
                                list : resp.Search
                            }
                        ]
                    })
                    .catch(()=>{
                        db.put({
                            _id: `Horizontal-Movie-Card-${searchItem}`,
                            searchItem: searchItem,
                            movieList: [
                                {
                                    page: 1,
                                    list: resp.Search
                                }
                            ]
                        }, () => { console.log("occurd") })
                    })

                } else {
                    // setting movies not found
                    setNotFound(true)
                }
            })
            .catch(err => {
                // getting if movies available in database
                db.get(`Horizontal-Movie-Card-${searchItem}`)
                .then(resp => {
                    let movies = resp?.movieList;
                    let moviesData;
                    if (movies?.length > 0) {
                        for (var i = 0; i < movies?.length; i++) {
                            if (movies[i]?.page === 1) {
                                moviesData = movies[i].list;
                                break;
                            }
                        }
                    }

                    if (moviesData) {
                        setMovies(moviesData)
                    }

                    setError("Loading movies from the previously loaded data.")
                    setTimeout(() => {
                        setError("")
                    }, 5000);
                })
                // if not available
                .catch(error => {
                    setError("Couldn't load the movies, please check the network connection and tryagain.")
                    setTimeout(() => {
                        setError("")
                    }, 5000);
                })

            })
    }, [])

    useEffect(() => {
        // update the scroll amount of MovieCard in percentage
        MovieCard.current.onscroll = () => {
            setScrolledPercentage(100 * (MovieCard.current.scrollLeft / (MovieCard.current.scrollWidth - MovieCard.current.clientWidth)))
        }
    }, [])

    const MovieTemplate = () => {
        // MovieTemplate is used to display movies are loading
        // and if available that it will display
        return movies.length === 0 && notFound === false ?
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(() => <LoadingMovie key={Math.random() * 99999} />)
            :
            notFound === true ?
                // if movies are not available
                <b>Movies not found for searched Item : {searchItem}</b>
                :
                // show the movies
                movies.map(movie => <Movie movie={movie} key={Math.random() * 99999} />)
    }

    return (
        <div className="Horizontal-container">
            <header className="header">{searchItem}</header>

            <div className="Horizontal-Card" ref={MovieCard}>
                {
                    error ?
                        <>
                            <Notification text={error} />
                            <MovieTemplate />
                        </>
                        :
                        <MovieTemplate />
                }
                {
                    notFound !== true && movies.length >= 10 ?
                        <button className="load-more-btn" onClick={() => {
                            // redirecting to the 2nd page because 1st page is already showed
                            return navigate({
                                pathname: "s",
                                search: `?movie=${searchItem}&page=2`
                            })
                        }}>Load more...</button>
                        :
                        []
                }
            </div>

            {
                notFound !== true ?
                    // if mobile then do not show scrolling buttons
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) === false ?
                        movies.length > 0 ?
                            <div className="buttons-horizontal">
                                <button className="load-more-btn prev" onClick={() => {
                                    MovieCard.current.scroll(MovieCard.current.scrollLeft - window.innerWidth / 1.5, 0)
                                }}
                                // if Moviecard is not scrolled or at the first then disable the previous button
                                    disabled={scrolledPercentage < 1}
                                >
                                    <Bootstrap.BsCaretLeft />
                                </button>
                                <button className="load-more-btn next" onClick={() => {
                                    MovieCard.current.scroll(MovieCard.current.scrollLeft + window.innerWidth / 1.5, 0)
                                }}
                                    disabled={scrolledPercentage >= 99}
                                >
                                    <Bootstrap.BsCaretRight />
                                </button>
                            </div>
                            :
                            []
                        :
                        []
                    :
                    []
            }
        </div>
    )
}

export default HorizontalCard;