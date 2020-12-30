import React from "react";

function ChatHeader(props) {
  return (
    <div className="chatHeader">
      <div className="chatHeaderInside">
          {props.loading ? (
        <div className="loadbar"></div>
          ) : 
        props.onlineUsers.includes(props.chatUser._id) ? (
          <div className="chatStatus">
            <div className="chatStatusPicWrapper">
              <div
                className="chatStatusPic"
                style={{ backgroundImage: `url(${props.chatUser.profileImg})` }}
              ></div>
              <div className="borderNoBlur"></div>
            </div>
            <span className="chatStatusText">
              {props.chatUser.name} is currently online{" "}
            </span>
            <div className="currentlyOnline"></div>
          </div>
        ) : (
          <div className="chatStatus">
            <div className="chatStatusPicWrapper">
              <div
                className="chatStatusPic"
                style={{ backgroundImage: `url(${props.chatUser.profileImg})` }}
              ></div>
              <div className="borderNoBlur"></div>
            </div>
            <span className="chatStatusText">
              You and {props.chatUser.name} are connected since{" "}
              {new Date(props.matchDate).toLocaleDateString()}.{" "}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatHeader;
