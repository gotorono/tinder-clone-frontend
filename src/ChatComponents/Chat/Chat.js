import React, { useState, useEffect } from "react";
import "./Chat.css";

import axios from "../../axios";

import classnames from "classnames";

import { socket } from "../../socket";

import Scrollbar from "../../Scrollbar";

import { getMatchString } from "../../variables";

import { animateScroll } from "react-scroll";

import { connect } from "react-redux";

//CHAT COMPONENTS

import Message from "./Message";
import NoMessages from "./NoMessages";
import MessageInput from "./MessageInput";

import ChatHeader from "./ChatHeader";

function Chat(props) {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [matchDate, setMatchDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);

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
    if(messages.length === 0) {
      props.forceActiveChatsRender();
    }
    setMessages([...messages, msg]);
    scrollToBottom();
  };

  useEffect(() => {
    setOnlineUsers(props.onlineUsers);
  }, [props.onlineUsers]);

  useEffect(() => {
    fetchMessages();

    return () => {
      if (matchString !== "") socket.emit("leave", matchString);
    };
  }, [matchString]);

  useEffect(() => {
    setLoading(true);
    if (props.id) {
      getMatchString(props.auth.user.id, props.id).then((data) => {
        setMatchString(data);
        socket.emit("join", data);
        setTimeout(function() {
          props.notSeen();
        }, 250)
      });
    } else {
      setMatchString("");
    }

    getProfile();
    getMatches();
  }, [props.id]);

  useEffect(() => {
    socket.on("receiveMsg", msgHandler);

    return () => socket.off("receiveMsg");
  }, [messages]);

  async function getProfile() {
    setLoadingProfile(true);
    const req = await axios.get("/tinder/users/profile/get", {
      params: { _id: props.id },
    });
    setLoadingProfile(false);
    setChatUser(req.data);
  }

  async function getMatches() {
    const req = await axios.get("/tinder/users/matches", {
      params: { user: props.auth.user.id },
    });
    getMatchDate(req.data);
  }

  const getMatchDate = (matches) => {
    matches.map((match) => {
      if (match.id === props.id) setMatchDate(match.date);
    });
  };

  async function fetchMessages() {
    setLoading(true);
    const req = await axios.get("/tinder/messages/get", {
      params: { matchString },
    });
    setLoading(false);
    setMessages(
      req.data.map(({ _id, body, from, timeSent }) => ({
        _id,
        message: body,
        origin: from,
        timeSent,
      }))
    );
    scrollToBottom();
  }

  const handleSendMessage = (message) => {
    if (message !== "") {
      socket.emit("message", {
        from: props.auth.user.id,
        to: props.id,
        matchString,
        message: message,
        origin: props.auth.user.id,
      });
    }
  };

  return (
    <div className="chatWrapper">
      <ChatHeader
        onlineUsers={onlineUsers}
        chatUser={chatUser}
        loading={loadingProfile}
        matchDate={matchDate}
      />
      {loading ? (
        <div className="loadingChatMessages">
          <div className="loadbar" />
        </div>
      ) : messages.length > 0 ? (
        <Scrollbar className="chatMessagesWrapper" style={{ marginBottom: 0 }}>
          {messages.map((msgObject, index) =>
            msgObject.origin === props.auth.user.id ? (
              <Message
                type="right"
                msgObject={msgObject}
                index={index}
                messages={messages}
                profileImg={props.auth.user.profileImg}
                key={msgObject._id ? msgObject._id : index}
              />
            ) : (
              <Message
                type="left"
                msgObject={msgObject}
                index={index}
                messages={messages}
                chatUserProfileImg={chatUser.profileImg}
                key={msgObject._id ? msgObject._id : index}
              />
            )
          )}
        </Scrollbar>
      ) : (
        <Scrollbar
          style={{ display: "flex", alignItems: "center" }}
          className="chatMessagesWrapper nomessage"
          style={{ marginBottom: 0 }}
        >
          <NoMessages matchDate={matchDate} chatUser={chatUser} />
        </Scrollbar>
      )}

      <MessageInput handleSendMessage={handleSendMessage} />
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Chat);
