import React, { useState, useEffect } from "react";

import "./Main.css";

import { socket } from "../socket";

import { connect } from "react-redux";

import classnames from "classnames";

import Header from "../Header";

import ChatWindow from "../Chat/ChatWindow";

import ChatList from "../Chat/ChatList";
import Matches from "../Matches/Matches";
import Profile from "../Profile/Profile";
import ProfileSettings from "../Profile/ProfileSettings";
import TinderCards from "../TinderCards";
import SwipeButtons from "../SwipeButtons";

function Main(props) {
  const [refresh, setRefresh] = useState({ swipe: 0 });

  const [matchUser, setMatchUser] = useState("");

  const [render, setRender] = useState("matches");

  const [onlineUsers, setOnlineUsers] = useState([]);

  const [empty, setEmpty] = useState(null);

  const [subComp, setSubComp] = useState("matches");

  useEffect(() => {
    socket.emit("userBecameOnline", props.auth.user.id);
  }, []);

  useEffect(() => {
    socket.on("sendOnlineMatches", (onlineUsers) => {
      setOnlineUsers(onlineUsers);
    });

    socket.on("online", (userId) => {
      setOnlineUsers([...new Set([...onlineUsers, userId])]);
    });

    socket.on("offline", (userId) => {
      setOnlineUsers(onlineUsers.filter((id) => id !== userId));
    });

    return () => {
      socket.off("sendOnlineMatches");
      socket.off("online");
      socket.off("offline");
    };
  }, [onlineUsers]);

  function swipe(value) {
    setRefresh({ swipe: value });
  }

  function route(value) {
    setRender(value);
  }

  function match(value) {
    setMatchUser(value);
  }

  function emptyFnc(value) {
    setEmpty(value);
  }

  function _renderMainComp() {
    if (props.match.params.id) {
      return (
        <div className="app">
          <ChatWindow id={props.match.params.id} onlineUsers={onlineUsers} />
        </div>
      );
    }
    if (window.location.pathname === "/app/profile") {
      return (
        <div className="app">
          <Profile />
        </div>
      );
    } else {
      return (
        <div className="app">
          {empty === true ? (
            <div className="emptyWrapper">
              <div className="emptyInside">
                <div
                  className="pictureEmpty"
                  style={{
                    backgroundImage: `url(${props.auth.user.profileImg})`,
                  }}
                >
                  <div className="circleOne"></div>
                  <div className="circleTwo"></div>
                  <div className="circleOneCopy"></div>
                  <div className="circleTwoCopy"></div>
                </div>
                <div className="noConnections">No more connections found</div>
                <div className="tryRealLife">Try real life!</div>
              </div>
            </div>
          ) : (
            <div className={classnames("", empty !== false ? "hidden" : "")}>
              <TinderCards
                matchFnc={match}
                refresh={refresh}
                empty={emptyFnc}
              />
              {empty !== null ? <SwipeButtons swipe={swipe} /> : null}
            </div>
          )}
        </div>
      );
    }
  }

  return (
    <div className="main">
      <div className="sidebar">
        <Header route={route} />
        <div
          className={classnames(
            "sidebarItemSelectorWrapper",
               subComp === "matches"
              ? "matches"
              : subComp === "messages"
              ? "messages"
              : ""
          )}
        >
          <button
            className="sidebarItemSelector matches"
            onClick={() => setSubComp("matches")}
          >
            Matches
          </button>
          <button
            className="sidebarItemSelector messages"
            onClick={() => setSubComp("messages")}
          >
            Messages
          </button>
        </div>
        <div
          className={classnames(
            "sidebarItem matches",
            subComp === "matches"
                ? ""
              : "hidden"
          )}
        >
          <Matches
            match={matchUser}
            onlineUsers={onlineUsers}
            activeChat={props.match.params.id}
          />
        </div>
        <div
          className={classnames(
            "sidebarItem messages",
            subComp === "messages"
                ? ""
              : "hidden"
          )}
        >
          <ChatList
            activeChat={props.match.params.id}
            onlineUsers={onlineUsers}
          />
        </div>

        <div
          className={classnames(
            "sidebarItem profile",
            window.location.pathname === "/app/profile" ? "" : "hidden"
          )}
        >
          <ProfileSettings />
        </div>
      </div>
      {/* {_renderMainComp()} */}
      <div className="app">
        <div className={classnames("", props.match.params.id ? "" : "hidden")}>
          <ChatWindow id={props.match.params.id} onlineUsers={onlineUsers} />
        </div>
        <div
          className={classnames(
            "",
            window.location.pathname === "/app/profile" ? "" : "hidden"
          )}
        >
          <Profile />
        </div>
        <div className={classnames("", empty === true && props.match.params.id === undefined && window.location.pathname !== "/app/profile"  ? "" : "hidden")}>
          <div className="emptyWrapper">
            <div className="emptyInside">
              <div
                className="pictureEmpty"
                style={{
                  backgroundImage: `url(${props.auth.user.profileImg})`,
                }}
              >
                <div className="circleOne"></div>
                <div className="circleTwo"></div>
                <div className="circleOneCopy"></div>
                <div className="circleTwoCopy"></div>
              </div>
              <div className="noConnections">No more connections found</div>
              <div className="tryRealLife">Try real life!</div>
            </div>
          </div>
        </div>

        <div className={classnames("", empty === true ? "hidden" : "")}>
          <TinderCards matchFnc={match} refresh={refresh} empty={emptyFnc} />
          <div className={classnames("", empty !== null ? "" : "hidden")}>
            <SwipeButtons swipe={swipe} />
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Main);
