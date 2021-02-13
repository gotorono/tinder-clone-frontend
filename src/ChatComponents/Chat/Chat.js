import React, { useState, useEffect } from "react";
import "./Chat.css";

import axios from "../../axios";
import { socket } from "../../socket";
import Scrollbar from "../../Scrollbar";
import { getMatchString } from "../../variables";
import { animateScroll } from "react-scroll";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//CHAT COMPONENTS

import { dateDiffInMinutes } from "../../variables";

import Message from "./Message";
import NoMessages from "./NoMessages";
import MessageInput from "./MessageInput";
import DateLine from "./DateLine";
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

  useEffect(() => {
    setOnlineUsers(props.onlineUsers);
  }, [props.onlineUsers]);

  useEffect(() => {
    async function fetchMessages() {
      if (matchString !== "") {
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
    }

    fetchMessages();

    return () => {
      if (matchString !== "") socket.emit("leave", matchString);
    };
  }, [matchString]);

  useEffect(() => {
    async function getProfile() {
      setLoadingProfile(true);
      const req = await axios.get("/tinder/users/profile/get", {
        params: { _id: props.id },
      });
      setLoadingProfile(false);
      setChatUser(req.data);
    }

    const getMatchDate = (matches) => {
      matches.map((match) => {
        if (match.id === props.id) setMatchDate(match.date);
        return match;
      });
    };
  
    async function getMatches() {
      const req = await axios.get("/tinder/users/matches", {
        params: { user: props.auth.user.id },
      });
      getMatchDate(req.data);
    }

    setLoading(true);
    if (props.id) {
      getMatchString(props.auth.user.id, props.id).then((data) => {
        setMatchString(data);
        socket.emit("join", data);
        setTimeout(function () {
          props.notSeen();
        }, 250);
      });
    } else {
      setMatchString("");
    }

    getProfile();
    getMatches();
  }, [props.id, props.auth.user.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const msgHandler = (msg) => {
      if (messages.length === 0) {
        setTimeout(function () {
          props.forceActiveChatsRender();
        }, 250);
      }
      setMessages([...messages, msg]);
      scrollToBottom();
    };

    socket.on("receiveMsg", msgHandler);

    return () => socket.off("receiveMsg");
  }, [messages, props]);

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

  const timeDifferenceBetweenMessages = (a, b) => {
    const minutesDiff = dateDiffInMinutes(a, b);
    return minutesDiff;
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
          {messages.map((msgObject, index) => (
            <div key={index}>
              {index !== 0 ? (
                timeDifferenceBetweenMessages(
                  msgObject.timeSent,
                  messages[index - 1].timeSent
                ) > 30 ? (
                  <DateLine date={msgObject.timeSent} />
                ) : null
              ) : (
                <DateLine date={msgObject.timeSent} />
              )}

              {msgObject.origin === props.auth.user.id ? (
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
              )}
            </div>
          ))}
        </Scrollbar>
      ) : (
        <Scrollbar
          style={{ display: "flex", alignItems: "center", marginBottom: 0 }}
          className="chatMessagesWrapper nomessage"
        >
          <NoMessages matchDate={matchDate} chatUser={chatUser} />
        </Scrollbar>
      )}

      <MessageInput handleSendMessage={handleSendMessage} chessGameInvite={() => props.history.push(`/app/chess/${chatUser._id}`)} />
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(withRouter(Chat));
