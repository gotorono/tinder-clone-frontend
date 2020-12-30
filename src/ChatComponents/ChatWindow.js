import React from "react";
import "./ChatWindow.css";

import Chat from "./Chat/Chat";
import ChatMatchProfile from "./ChatMatchProfile";

function ChatWindow(props) {

  return (
    <div className="chatWindow">
        <Chat id={props.id} onlineUsers={props.onlineUsers} notSeen={props.notSeen} forceActiveChatsRender={props.forceActiveChatsRender} />
        <ChatMatchProfile id={props.id} />
    </div>
  );
}

export default ChatWindow;
