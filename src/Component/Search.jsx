/*
Search Component /s : route
*/
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import "./Search.css"
import axios from "axios"
import { config } from "../config";
import Notification from "./Notification"
import Movies from "./Movies";

const Search = () => {
    // getting search param
    const [searchParams, setSearchParams] = useSearchParams(window.location.search)

    // movie name to search
    const [movieName, setMovieName] = useState(searchParams.get("movie") || "")
    // page of movie
    const moviePage = parseInt(searchParams.get("page"));

    // is movie loading or not
    const [isMovieLoading, setMovieLoading] = useState(false)

    // list of movies
    const [movieList, setMovieList] = useState([]);
    // warning if any
    const [warning, setWarning] = useState("");

    const TopElement = useRef()

    const send_request = async ({ movie, page }) => {
        // send the request to get movies
        let req = await axios.get(`https://www.omdbapi.com/?s=${movie}&apikey=${config.API_KEY}&page=${page}`)
        return req.data;
    }

    const SearchMovie = async ({ movie, page }) => {
        try {
            setMovieLoading(true)

            // sending request for the movie data
            let response = await send_request({ movie, page })

            // is response is true
            if (response.Response === "True") {
                setMovieList(response.Search)

                // scroll to top of window
                window.scrollTo(0, TopElement.current.offsetTop)

            } else if (response.Response === "False") {
                // set warning thrown by server
                setWarning(response.Error)
                setTimeout(() => {
                    setWarning("")
                }, 5500);
            }

        } catch (err) {
            if (err?.code === "ERR_NETWORK") {
                setWarning("Network connection error, tryagain later.")
            } else {
                setWarning(err.message)
            }
            setTimeout(() => {
                setWarning("")
            }, 5500);

        } finally {
            setMovieLoading(false)
        }
    }

    useEffect(() => {
        // if movie name available and page is greater than 0
        if (searchParams.get("movie") && moviePage >= 1) {
            if (movieName !== searchParams.get("movie")) {
                setMovieName(searchParams.get("movie"))
            }

            SearchMovie({
                movie: searchParams.get("movie"),
                page: moviePage
            })
        }
    }, [searchParams])


    return (
        <div className="movies-section">
            <form className="searchbox"
                onSubmit={e => {
                    // set search params on form submit
                    e.preventDefault();
                    setSearchParams({
                        movie: movieName,
                        page: 1
                    })
                }}>
                <input type={"search"}
                    className={"input-box"}
                    placeholder="Search movie..."
                    value={movieName}
                    onChange={e => setMovieName(e.target.value)}
                />
                <b>Type movie name in search box and hit enter to search movies.</b>
                <button type="submit" hidden></button>
            </form>
            {
                // if any warning
                warning ?
                    <Notification text={warning} />
                    :
                    []
            }

            {/* element only used to scroll to top */}
            <div ref={TopElement}></div>

            {/* Shows movies list */}
            <Movies movieList={movieList} searching={isMovieLoading} />

            {
                // button only will be shown when length is greater than 0
                movieList.length > 0 ?
                    isMovieLoading === false ?
                        <div className="btns">
                            <button type="button" onClick={() => { setSearchParams({ movie: searchParams.get("movie"), page: moviePage - 1 }) }}
                                className="load-more-btn"
                                disabled={moviePage < 2}
                            >Prev page</button>

                            <button type="button" onClick={() => { setSearchParams({ movie: searchParams.get("movie"), page: moviePage + 1 }) }}
                                disabled={movieList.length < 10}
                                className="load-more-btn"
                            >Next page</button>
                        </div>
                        :
                        []
                        :
                        []
            }
        </div>
    )
}

export default Search;