import React, { useState, useEffect } from "react";
import "./Chat.css";

import axios from "../axios";

import { socket } from "../socket";

import { getRoomString } from "../variables";

import { connect } from "react-redux";

function Chat(props) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const roomString = getRoomString(props.auth.user.id, props.id);

  useEffect(() => {
    socket.emit("join", roomString);
    fetchMessages();

    return () => socket.emit("leave", roomString);
  }, []);

  useEffect(() => {
    socket.on("receiveMsg", (msg) => {
      setMessages([...messages, msg]);
    });

    return () => {
      socket.off();
    };
  }, [messages]);

  async function fetchMessages() {
    const req = await axios.get("/tinder/messages/get", {
      params: { roomString },
    });
    setMessages(req.data.map( ({body, from }) => ({message: body, origin: from}) ))
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message !== "") {
      socket.emit("message", {
        from: props.auth.user.id,
        to: props.id,
        roomString,
        message: message,
        origin: props.auth.user.id,
      });
    }
    setMessage("");
  };

  return (
    <div className="chatWrapper">
      <div className="chatMessagesWrapper">
        {messages.map((msgObject, index) =>
          msgObject.origin === props.auth.user.id ? (
            <div className="message right" key={index}>
              <div className="messageTextWrapper">
                <span>{msgObject.message}</span>
              </div>
            </div>
          ) : (
            <div className="message left" key={index}>
              <div className="messageTextWrapper">
                <span>{msgObject.message}</span>
              </div>
            </div>
          )
        )}
      </div>
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
