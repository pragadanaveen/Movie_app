/*
contains cookie policy
*/

import { db } from "../db"
import "./CookiePolicy.css"

const CookiePolicy = () => {
    return(
        <div className="box">
            <div className="inner-box">
                <header>Cookie &amp; Content Policy</header>
                <div className="content">
                    <header>Data we collect</header>
                    <div className="text">
                        <p>
                            We do not collect the user's data but the APIs and other providers can collect the data.
                        </p>
                    </div>
                </div>

                <div className="content">
                    <header>Data we store</header>
                    <div className="text">
                        <p>
                            We store data such as pictures(Movie Poster), movie details, whenever you're offline then this data will be shown to you, also API providers can store data.
                        </p>
                    </div>
                </div>

                <div className="content">
                    <header></header>
                </div>

                <div className="content">
                    <header>Data We Show</header>
                    <div className="text">
                        <p>
                            All details of movies, series, etc. present on this website is provided by OMDB API. All details are based on US time, that means if movie released in India for 17 December but it is released in US on 7 January then it will show 7 January.
                        </p>
                    </div>
                </div>

                <button className="load-more-btn"
                onClick={()=>{
                    // here we don't have to catch the error because useEffect in App.js automatically
                    // creates one if not exists
                    db?.get("Cookie-Content-Policy")
                    .then(doc => {
                        // updating value
                        doc.CookieAndContentPolicyAgree = true
                        return db.put(doc)
                    })
                }}
                >I agree</button>
            </div>
        </div>
    )
}

export default CookiePolicy;