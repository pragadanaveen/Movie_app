/*
Home of application
*/

import { useEffect } from "react";
import { config } from "../config";
import HorizontalCard from "./HorizontalCard";

const Home = () => {
    useEffect(() => {
        // setting document title
        document.title = config.APP_NAME + " : Home";
    }, [])

    return (
        <div className="paged" id="Home-page">
            <header className="header">Movies and Series</header>
            {/*
            below are some horizontal card, need to pass only search term as shown below.
            */}
            <HorizontalCard searchItem={"Telugu"} key="Telugu" />
            <HorizontalCard searchItem={"Hindi"} key="Hindi" />
            <HorizontalCard searchItem={"English"} key="English" />

            <HorizontalCard searchItem={"Marvel"} key="Marvel" />
            <HorizontalCard searchItem={"Game of Thrones"} key="Game of Thrones" />
            <HorizontalCard searchItem={"Spider-Man"} key="Spider-Man" />
            <HorizontalCard searchItem={"Batman"} key="Batman" />
            <HorizontalCard searchItem={"Superman"} key="Superman" />
        </div>
    )
}

export default Home;
