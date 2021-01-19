import React, { useState, useEffect, useCallback } from "react";
import "./ChatList.css";
import { Link } from "react-router-dom";

import classnames from "classnames";

import axios from "../axios";

import { socket } from "../socket";

import { getNotSeenCount, getMatchString } from "../variables";

import { connect } from "react-redux";

function ChatList(props) {
  const [activeChats, setActiveChats] = useState([]);
  const [currentActiveChat, setCurrentActiveChat] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [matchString, setMatchString] = useState("");

  const getActiveChats = useCallback(async (currActiveChat) => {
    const res = await axios.get("/tinder/users/activeChats", {
      params: { _id: props.auth.user.id },
    });
    if (res.data !== "") {
      setActiveChats(
        res.data.map((chat) => {
          if (chat.userId === currActiveChat) {
            chat.notSeenCount = 0;
            chat.lastMessageSeen = true;
            return chat;
          } else {
            return chat;
          }
        })
      );
    }
  }, [props.auth.user.id]);

  useEffect(() => {
    socket.on("newMsg", ({ from, msg }) => {
      if (from === currentActiveChat || from === props.auth.user.id) {
        setActiveChats(
          activeChats.map((activeChat) => {
            if (activeChat.userId === currentActiveChat) {
              activeChat.lastMessage = msg;
              activeChat.lastMessageFromMe =
                from === props.auth.user.id ? true : false;
            }
            return activeChat;
          })
        );
      } else {
        getActiveChats();
        setTimeout(function () {
          props.notSeen();
        }, 250);
      }
    });

    return () => socket.off("newMsg");
  }, [matchString, activeChats, currentActiveChat, getActiveChats, props.auth.user.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (props.activeChat) {
      getMatchString(props.auth.user.id, props.activeChat).then((data) => {
        setMatchString(data);
      });
    }

    getActiveChats(props.activeChat);
    setCurrentActiveChat(props.activeChat);
  }, [props.activeChat, props.forceActiveChatsRender, props.auth.user.id, getActiveChats]);

  useEffect(() => {
    setOnlineUsers(props.onlineUsers);
  }, [props.onlineUsers]);

  const getNotSeen = (activeChat) => {
    return (
      <div>
        <div className="messageNotSeen">
          {getNotSeenCount(activeChat.notSeenCount)}
        </div>
        <div className="notSeenBorder"></div>
        <div className="notSeenBorderWhite"></div>
      </div>
    );
  };

  return (
    <div className="chatList">
      {activeChats.map((activeChat) => (
        <Link to={`/app/messages/${activeChat.userId}`} key={activeChat.userId}>
          <div
            className={classnames(
              "chatListingWrapper",
              currentActiveChat === activeChat.userId ? "active" : ""
            )}
          >
            <div className="chatListingInside">
              <div
                className="chatListingPic"
                style={{ backgroundImage: `url(${activeChat.pic})` }}
              >
                {!activeChat.lastMessageSeen && activeChat.notSeenCount > 0
                  ? getNotSeen(activeChat)
                  : null}
                {onlineUsers.includes(activeChat.userId) ? (
                  <div className="online" title="User is online"></div>
                ) : null}
              </div>
              <div className="chatListingDescWrapper">
                <div className="chatListingName">{activeChat.name}</div>
                <div className="chatListingMessage">
                  {activeChat.lastMessageFromMe
                    ? "Me: " + activeChat.lastMessage
                    : activeChat.lastMessage}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ChatList);
