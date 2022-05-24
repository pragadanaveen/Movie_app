/*
Home of application
*/

import HorizontalCard from "./HorizontalCard";

const Home = () => {
    return(
        <div className="paged" id="Home-page">
            <header className="header">Movies and Series</header>
            {/*
            below are some horizontal card, need to pass only search term as shown below.
            */}
            <HorizontalCard searchItem={"Marvel"} key="Marvel" />
            <HorizontalCard searchItem={"Spider-Man"} key="Spider-Man" />
            <HorizontalCard searchItem={"Batman"} key="Batman" />
            <HorizontalCard searchItem={"Superman"} key="Superman" />
        </div>
    )
}

export default Home;
