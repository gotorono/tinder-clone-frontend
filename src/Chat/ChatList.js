import React, { useState, useEffect } from "react";
import "./ChatList.css";
import { Link } from "react-router-dom";

import classnames from 'classnames';

import axios from "../axios";

import { connect } from "react-redux";

function ChatList(props) {
  const [activeChats, setActiveChats] = useState([]);
  const [currentActiveChat, setCurrentActiveChat] = useState("");

  const [onlineUsers, setOnlineUsers] = useState([]);

  const getActiveChats = async () => {
    const res = await axios.get("/tinder/users/activeChats", {
      params: { _id: props.auth.user.id },
    });

    setActiveChats(res.data);
  };

  useEffect(() => {
    getActiveChats();
  }, []);

  useEffect(() => {
    setCurrentActiveChat(props.activeChat);
  }, [props.activeChat])

  useEffect(() => {
    setOnlineUsers(props.onlineUsers);
  }, [props.onlineUsers]);

  console.log(activeChats);

  return (
    <div className="chatList">
      {activeChats.map((activeChat) => (
        <Link to={`/app/messages/${activeChat.userId}`} key={activeChat.userId}>
          <div className={classnames("chatListingWrapper", currentActiveChat === activeChat.userId ? "active" : "")} >
            <div className="chatListingInside">
            <div
              className="chatListingPic"
              style={{ backgroundImage: `url(${activeChat.pic})` }}
            >
            {onlineUsers.includes(activeChat.userId) ? <div className="online" title="User is online"></div> : null}
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
