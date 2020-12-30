import React from "react";

import classnames from "classnames";

import { dateDiffInDays } from "../../variables";

function Message(props) {

  const messageTimeSentHandler = (timeSent) => {
    if (dateDiffInDays(new Date(timeSent), new Date(Date.now())) > 6) {
      return (
        new Date(timeSent).toLocaleDateString([], {
          day: "numeric",
          month: "numeric",
        }) +
        " " +
        new Date(timeSent).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } else {
      return (
        new Date(timeSent).toLocaleDateString("en-us", { weekday: "long" }) +
        " " +
        new Date(timeSent).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
  };

  const checkIfImg = (index) => {
    let returnedBoolean =
      index + 1 < props.messages.length
        ? props.messages[index + 1].origin !== props.messages[index].origin
          ? true
          : false
        : index === props.messages.length - 1
        ? true
        : false;
    return returnedBoolean;
  };

  return (
    <div>
      {props.type === "right" ? (
        <div
          className={classnames(
            "message right",
            checkIfImg(props.index) ? "withImg" : null,
            props.index === 0
              ? "first"
              : props.index === props.messages.length - 1
              ? "last"
              : null
          )}
          key={props.msgObject._id}
        >
          <div className="messageTextWrapper">
            <div className="messageText">
              <span>{props.msgObject.message}</span>
            </div>
            <div className="messageTimeSent">
              {messageTimeSentHandler(props.msgObject.timeSent)}
            </div>
          </div>
          {checkIfImg(props.index) ? (
            <div
              className="userSentMessage"
              style={{
                backgroundImage: `url(${props.profileImg})`,
              }}
            ></div>
          ) : null}
        </div>
      ) : (
        <div
          className={classnames(
            "message left",
            checkIfImg(props.index) ? "withImg" : null,
            props.index === 0
              ? "first"
              : props.index === props.messages.length - 1
              ? "last"
              : null
          )}
          key={props.index}
        >
          {checkIfImg(props.index) ? (
            <div
              className="userSentMessage"
              style={{ backgroundImage: `url(${props.chatUserProfileImg})` }}
            ></div>
          ) : null}
          <div className="messageTextWrapper">
            <div className="messageText">
              <span>{props.msgObject.message}</span>
            </div>
            <div className="messageTimeSent">
              {messageTimeSentHandler(props.msgObject.timeSent)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Message;
