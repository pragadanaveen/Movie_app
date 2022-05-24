import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Component/Home";
import NavBar from "./Component/NavBar";
import Header from "./Component/Header";
import SpecificMovie from "./Component/SpecificMovie";
import {config } from "./config"
import { useEffect, useState } from "react";
import Search from "./Component/Search";
import CookiePolicy from "./Component/CookiePolicy";
import { db } from "./db";

const App = () => {
    // cookie policy
    const [ shouldShowCookiePolicy, setShowCookiePolicy ] = useState(false);

    useEffect(()=>{
        // getting if user accepted or not cookie policy
        db.get("Cookie-Content-Policy")
        .then(d=>{
            if(d?.CookieAndContentPolicyAgree !== true){
                setShowCookiePolicy(true)
            }
        })
        .catch(err => {
            // if db throws that doc not found then create one
            db.put({ CookieAndContentPolicyAgree : false, _id : "Cookie-Content-Policy" },()=>{console.log("cour")})
            setShowCookiePolicy(true)
        })

        // setting live changing
        db.changes({
            since : "now",
            live: true
        })
        .on("change",change => {
            if(change.id === "Cookie-Content-Policy"){
                db.get("Cookie-Content-Policy")
                .then(resp => {
                    if(resp.CookieAndContentPolicyAgree === true){
                        setShowCookiePolicy(false)
                    }
                })
            }
        })

    },[])

    return (
        <div className="App">
            <Header text={config.APP_NAME} />
            <div id="main-container">
                <BrowserRouter>
                    <NavBar />
                    <Routes>
                        <Route path="/" caseSensitive={true} element={<Home />} />
                        <Route path="/s" caseSensitive={true} element={<Search />} />
                        <Route path="/movie/:imdbId" caseSensitive={true} element={<SpecificMovie />} />
                    </Routes>
                </BrowserRouter>

                {
                    shouldShowCookiePolicy === true ?
                    <CookiePolicy />
                    :
                    []
                }
            </div>
        </div>
    )
}

export default App;