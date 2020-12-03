import React, { useState } from "react";

import "./Main.css";

import Header from "../Header";
import Messages from "../Messages/Messages";
import Matches from "../Matches/Matches";
import Profile from "../Profile/Profile";
import ProfileSettings from "../Profile/ProfileSettings";
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
    if (window.location.pathname === "/app/profile") {
      return <ProfileSettings />;
    } else {
      switch (render) {
        case "matches":
          return <Matches match={matchUser} />;
        case "profile":
          return <ProfileSettings />;
        case "messages":
          return <Messages />;
      }
    }
  }

  function _renderMainComp() {
    if (window.location.pathname === "/app/profile") {
      return (
        <div className="app">
          <Profile />
        </div>
      );
    } else {
      return (
        <div className="app">
          <TinderCards matchFnc={match} refresh={refresh} />
          <SwipeButtons swipe={swipe} />
        </div>
      );
    }
  }

  return (
    <div className="main">
      <div className="sidebar">
        <Header route={route} />
        {_renderSubComp()}
      </div>
      {_renderMainComp()}
    </div>
  );
}

export default Main;
