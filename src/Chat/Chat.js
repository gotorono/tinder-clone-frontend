import React, { useState, useEffect } from "react";
import "./Chat.css";

import axios from "../axios";

import classnames from "classnames";

import { socket } from "../socket";

import Scrollbar from "../Scrollbar";

import { getMatchString } from "../variables";

import { animateScroll } from "react-scroll";

import { connect } from "react-redux";

function Chat(props) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [matchDate, setMatchDate] = useState("");

  const [matchString, setMatchString] = useState("");

  const [chatUser, setChatUser] = useState({});

  const scrollToBottom = () => {
    animateScroll.scrollToBottom({
      containerId: "chatMessagesWrapper",
      duration: 0,
      delay: 0,
      smooth: false,
    });
  };

  const msgHandler = (msg) => {
    setMessages([...messages, msg]);
    scrollToBottom();
  };

  useEffect(() => {
    setOnlineUsers(props.onlineUsers);
  }, [props.onlineUsers]);

  useEffect(() => {
    if(matchString !== "")
      socket.emit("join", matchString);
      
      if(props.id) {
      getMatchString(props.auth.user.id, props.id).then((data) => {
        setMatchString(data);
      })
    }

    fetchMessages();
    getProfile();
    getMatches();

    return () => {
      socket.emit("leave", matchString);
    };
  }, [props.id, matchString]);

  useEffect(() => {
    socket.on("receiveMsg", msgHandler);

    return () => socket.off("receiveMsg");
  }, [messages]);

  async function getProfile() {
    const req = await axios.get("/tinder/users/profile/get", {
      params: { _id: props.id },
    });
    setChatUser(req.data);
  }

  async function getMatches() {
    const req = await axios.get("/tinder/users/matches", {
      params: { user: props.auth.user.id },
    });
    getMatchDate(req.data);
  }

  const getMatchDate = (matches) => {
    matches.map( (match) => {
      if(match.id === props.id)
        setMatchDate(match.date);
    } )
  }

  async function fetchMessages() {
    const req = await axios.get("/tinder/messages/get", {
      params: { matchString },
    });
    setMessages(
      req.data.map(({ body, from, timeSent }) => ({
        message: body,
        origin: from,
        timeSent,
      }))
    );
    scrollToBottom();
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message !== "") {
      socket.emit("message", {
        from: props.auth.user.id,
        to: props.id,
        matchString,
        message: message,
        origin: props.auth.user.id,
      });
    }
    setMessage("");
  };

  const checkIfImg = (index) => {
    let returnedBoolean =
      index + 1 < messages.length
        ? messages[index + 1].origin !== messages[index].origin
          ? true
          : false
        : index === messages.length - 1
        ? true
        : false;
    return returnedBoolean;
  };

  return (
    <div className="chatWrapper">
      <div className="chatHeader">
        <div className="chatHeaderInside">
          {onlineUsers.includes(props.id) ? (
            <div className="chatStatus">
              <div className="chatStatusPicWrapper">
                <div
                  className="chatStatusPic"
                  style={{ backgroundImage: `url(${chatUser.profileImg})` }}
                ></div>
                <div className="borderNoBlur"></div>
              </div>
              <span className="chatStatusText">
              {chatUser.name} is currently online{" "}
              </span>
              <div className="currentlyOnline"></div>
            </div>
          ) : (
            <div className="chatStatus">
              <div className="chatStatusPicWrapper">
                <div
                  className="chatStatusPic"
                  style={{ backgroundImage: `url(${chatUser.profileImg})` }}
                ></div>
                <div className="borderNoBlur"></div>
              </div>
              <span className="chatStatusText">
              You and {chatUser.name} are connected since {new Date(matchDate).toLocaleDateString()}.{" "}
              </span>
            </div>
          )}
        </div>
      </div>
      <Scrollbar className="chatMessagesWrapper" style={{ marginBottom: 0 }}>
        {messages.map((msgObject, index) =>
          msgObject.origin === props.auth.user.id ? (
            <div
              className={classnames(
                "message right",
                checkIfImg(index) ? "withImg" : null, index === 0 ? "first" : index === messages.length - 1 ? "last" : null
              )}
              key={index}
            >
              <div className="messageTextWrapper">
                <span>{msgObject.message}</span>
              </div>
              {checkIfImg(index) ? (
                <div
                  className="userSentMessage"
                  style={{
                    backgroundImage: `url(${props.auth.user.profileImg})`,
                  }}
                ></div>
              ) : null}
            </div>
          ) : (
            <div
              className={classnames(
                "message left",
                checkIfImg(index) ? "withImg" : null, index === 0 ? "first" : index === messages.length - 1 ? "last" : null
              )}
              key={index}
            >
              {checkIfImg(index) ? (
                <div
                  className="userSentMessage"
                  style={{ backgroundImage: `url(${chatUser.profileImg})` }}
                ></div>
              ) : null}
              <div className="messageTextWrapper">
                <span>{msgObject.message}</span>
              </div>
            </div>
          )
        )}
      </Scrollbar>
      <div className="messageField">
        <input
          type="text"
          onKeyPress={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />

        <input
          type="submit"
          value="SEND"
          onClick={(e) => handleSendMessage(e)}
        />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Chat);
