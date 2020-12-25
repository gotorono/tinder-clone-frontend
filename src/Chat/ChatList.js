import React, { useState, useEffect } from "react";
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

  const [lastMessage, setLastMessage] = useState("");

  useEffect(() => {
    socket.on("newMsg", (from) => {
      if (from !== currentActiveChat && from !== props.auth.user.id) {
        getActiveChats();
      } else {
        getLastMessage();
      }
    });

    return () => socket.off("newMsg");
  }, [matchString, activeChats]);

  useEffect(() => {
    if (props.activeChat) {
      getMatchString(props.auth.user.id, props.activeChat).then((data) => {
        setMatchString(data);
      });
    }

    getActiveChats();

    setCurrentActiveChat(props.activeChat);

  }, [props.activeChat]);

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

  const getLastMessage = () => {
    console.log('last message');
    setTimeout(async() => {
      const req = await axios.get("/tinder/messages/last", {
        params: { currentId: props.auth.user.id, matchString },
      });

      activeChats.map((activeChat) => {
        if(activeChat.id === props.activeChat) {
          activeChat.lastMessage = req.data.lastMessage;
          activeChat.lastMessageFromMe = req.data.lastMessageFromMe;
        }
      })
  
      setLastMessage(req.data);
    }, 250)
  };

  const getActiveChats = async () => {
    const res = await axios.get("/tinder/users/activeChats", {
      params: { _id: props.auth.user.id },
    });

    setActiveChats(res.data);
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
