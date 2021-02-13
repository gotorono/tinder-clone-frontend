import React, { useState, useEffect, useCallback } from "react";

import "./Main.css";

import { socket } from "../socket";

import { connect } from "react-redux";

import classnames from "classnames";

import Header from "../Header";

import ChatWindow from "../ChatComponents/ChatWindow";

import axios from "../axios";

import ChatList from "../ChatComponents/ChatList";
import Matches from "../Matches/Matches";
import Profile from "../Profile/Profile";
import ProfileSettings from "../Profile/ProfileSettings";
import TinderCards from "../TinderCards";
import SwipeButtons from "../SwipeButtons";
import Board from "../Chess/Board/Board";

import { getNotSeenCount } from "../variables";

function Main(props) {
  const [refresh, setRefresh] = useState({ swipe: 0 });

  const [matchUser, setMatchUser] = useState({});

  const [forceActiveChats, setForceActiveChats] = useState(false);

  const [notSeenCount, setNotSeenCount] = useState(0);

  const [onlineUsers, setOnlineUsers] = useState([]);

  const [empty, setEmpty] = useState(null);

  const [forceUpdate, setForceUpdate] = useState(false);

  const [subComp, setSubComp] = useState("matches");

  const [playing, setPlaying] = useState("");

  const notSeenHandler = useCallback(async () => {
    const req = await axios.get("/tinder/messages/notSeen", {
      params: {
        _id: props.auth.user.id,
      },
    });
    setNotSeenCount(getNotSeenCount(req.data));
  }, [props.auth.user.id]);

  const sides = (state) => {
    if(state.white === props.auth.user.id)
      setPlaying("white");
    else
      setPlaying("black");
  }

  useEffect(() => {
    socket.emit("userBecameOnline", props.auth.user.id);
    notSeenHandler();
  }, [props.auth.user.id, notSeenHandler]);

  useEffect(() => {
    if(props.match.params.game !== "") {

    }
  }, [props.match.params.game])

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

  function match(value) {
    setMatchUser(value);
  }

  function emptyFnc(value) {
    setEmpty(value);
  }

  function forceActiveChatsRender() {
    setForceActiveChats(!forceActiveChats);
  }

  return (
    <div className="main">
      <div className="sidebar">
        <Header />
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
            {notSeenCount === 0 ? null : (
              <div className="notSeenMessages">{notSeenCount}</div>
            )}
          </button>
        </div>
        <div
          className={classnames(
            "sidebarItem matches",
            subComp === "matches" ? "" : "hidden"
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
            subComp === "messages" ? "" : "hidden"
          )}
        >
          <ChatList
            activeChat={props.match.params.id}
            onlineUsers={onlineUsers}
            notSeen={notSeenHandler}
            forceActiveChatsRender={forceActiveChats}
          />
        </div>

        <div
          className={classnames(
            "sidebarItem profile",
            window.location.pathname === "/app/profile" ? "" : "hidden"
          )}
        >
          <ProfileSettings forceUpdate={() => setForceUpdate(!forceUpdate)} />
        </div>
      </div>
      <div className="app">
        <div
          className={classnames(
            "chatWindow",
            props.match.params.id ? "" : "hidden"
          )}
        >
          <ChatWindow
            id={props.match.params.id}
            onlineUsers={onlineUsers}
            notSeen={notSeenHandler}
            forceActiveChatsRender={forceActiveChatsRender}
          />
        </div>
        <div
          className={classnames(
            "profile",
            props.match.params.id ? "fromChat" : "",
            window.location.pathname === "/app/profile" ? "" : "hidden"
          )}
        >
          <Profile />
        </div>
        {props.match.params.game ? (
          <div
            className={classnames(
              "chess"
              // props.match.params.game ? "" : "hidden"
            )}
          >
            <Board playing={playing} sides={sides} />
          </div>
        ) : null}

        <div className={classnames("", empty === true ? "" : "hidden")}>
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
          <TinderCards
            matchFnc={match}
            refresh={refresh}
            forceUpdate={forceUpdate}
            empty={emptyFnc}
          />
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
