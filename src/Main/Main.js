import React, { useState } from "react";

import "./Main.css";

import Header from "../Header";
import Messages from "../Messages/Messages";
import Matches from "../Matches/Matches";
import Profile from "../Profile/Profile";
import TinderCards from "../TinderCards";
import SwipeButtons from "../SwipeButtons";

function Main() {
  const [refresh, setRefresh] = useState({ swipe: 0 });

  const [matchUser, setMatchUser] = useState("");

  const [render, setRender] = useState("matches");

  function swipe(value) {
    setRefresh({ swipe: value });
  }

  function route(value) {
    setRender(value);
  }

  function match(value) {
    setMatchUser(value);
  }

  function _renderSubComp() {
    if(window.location.pathname === '/app/profile') {
        return <Profile />
    }
    else {
      switch (render) {
        case "matches":
          return <Matches match={matchUser} />;
        case "profile":
          return <Profile />;
        case "messages":
          return <Messages />;
      }
    }
  }

  return (
    <div className="main">
      <div className="sidebar">
        <Header route={route} />
        {_renderSubComp()}
      </div>
      <div className="app">
        <TinderCards matchFnc={match} refresh={refresh} />
        <SwipeButtons swipe={swipe} />
      </div>
    </div>
  );
}

export default Main;
