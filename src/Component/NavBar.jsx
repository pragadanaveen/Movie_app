import { Link, useResolvedPath, useMatch } from "react-router-dom";
import "./NavBar.css"
import * as Bootstrap from "react-icons/bs"

// below function will be used to set the active class name
const CustomLink = ({ children, to, ...props }) => {
    let resolved = useResolvedPath(to);
    let match = useMatch({ path: resolved.pathname, end: true });

    return (
        <Link
            className={match ? "activeNav" : ""}
            to={to}
            {...props}
        >
            {children}
        </Link>
    );
}


const NavBar = () => {
    return (
        <nav className="NavBar">
            <CustomLink to={"/"}>
                <span>
                    {
                        // if current location is /
                        useMatch({ path: "/", end: true }) ?
                            <Bootstrap.BsHouseFill size={"25px"} />
                            :
                            <Bootstrap.BsHouse size={"25px"} />
                    }
                </span>
                <span className="text">Home</span>
            </CustomLink>
            <CustomLink to={"/s"}>
                <span><Bootstrap.BsSearch size={"25px"} /></span>
                <span className="text">Search</span>
            </CustomLink>

        </nav>
    )
}

export default NavBar;