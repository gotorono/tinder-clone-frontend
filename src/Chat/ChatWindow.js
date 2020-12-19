import React, {useState, useEffect} from "react";
import "./ChatWindow.css";

import Chat from "./Chat";
import ChatMatchProfile from "./ChatMatchProfile";

function ChatWindow(props) {

  return (
    <div className="chatWindow">
        <Chat id={props.id} onlineUsers={props.onlineUsers} />
        <ChatMatchProfile id={props.id} />
    </div>
  );
}

export default ChatWindow;
