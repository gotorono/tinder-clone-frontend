import React, { useState, useEffect } from "react";
import "./ChatList.css";
import { Link } from "react-router-dom";

import axios from "../axios";

import classnames from "classnames";

import { connect } from "react-redux";

function ChatList(props) {
  const [activeChats, setActiveChats] = useState([]);

  const getActiveChats = async () => {
    const res = await axios.get("/tinder/users/activeChats", {
      params: { _id: props.auth.user.id },
    });

    setActiveChats(res.data);
  };

  useEffect(() => {
    getActiveChats();
  }, []);

  console.log(activeChats);

  return (
    <div className="chatList">
      {activeChats.map((activeChat) => (
        <Link to={`/app/messages/${activeChat.userId}`} key={activeChat.userId}>
          <div className="chatListingWrapper">
            <div className="chatListingInside">
            <div
              className="chatListingPic"
              style={{ backgroundImage: `url(${activeChat.pic})` }}
            ></div>
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
