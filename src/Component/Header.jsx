/*
Header component of App
*/

import { useEffect, useState } from "react";
import "./Header.css"

const Header = ({text}) => {
    // below states are used to display header in-format
    // if user is scrolling window down then header won't be shown
    // when user suddenly scroll up window then header will be showed
    // this will be done by setting position[absolute, fixed]
    const [ currentScroll, setCurrentScroll ] = useState(0)
    const [ prevScroll, setPrevScroll ] = useState(0)
    const [ pos, setPos ] = useState("fixed")

    useEffect(()=>{
        // adding function to listener
        window.onscroll = () => {
            setCurrentScroll(window.scrollY);
        }
    },[])

    useEffect(()=>{
        // when currentScroll value changes
        setPrevScroll(currentScroll);
        setPos(prevScroll > currentScroll ? "fixed" : "absolute");
    },[currentScroll])

    return(
        <header className="main-header" style={{position:pos}}>{text}</header>
    )
}

export default Header;