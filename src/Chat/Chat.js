import React, { useState, useEffect } from "react";
import "./Chat.css";

import { socket } from '../socket';

import { getRoomString } from '../variables';

import { connect } from "react-redux";

function Chat(props) {

  console.log(getRoomString(props.auth.user.id, props.id));

  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.emit('join', {  });
  })

  const handleMessageBox = (e) => {
    setMessage(e.target.value);
  }

  const handleSendMessage = () => {
    //socket.emit('message', {for: props.id, msg: message});
  }

  return (
    <div className="chatWrapper">
      <div className="chatMessagesWrapper">
        <div className="message right">
          <div className="messageTextWrapper">
            <span>Message from me random text random text random text random text random text random text random text random text </span>
          </div>
        </div>
        <div className="message left">
          <div className="messageTextWrapper">
          <span>Random text text text</span>
          </div>
        </div>
      </div>
      <div className="messageField">
        <input type="text" onKeyUp={(e) => handleMessageBox(e)} />

        <input type="submit" value="SEND" onClick={handleSendMessage}/>


        </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Chat);
