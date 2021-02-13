import React, { useState } from "react";

import { useClickAway } from "use-click-away";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import EmojiPicker from "../EmojiPicker";
import classnames from "classnames";


function MessageInput(props) {
  const [message, setMessage] = useState("");

  const [emojiPickerActive, setEmojiPickerActive] = useState(false);
  const [clickAwayOrigin, setClickAwayOrigin] = useState(false);


  const clickOnEmoji = (emoji) => {
    setMessage(message + emoji);
    setEmojiPickerActive(false);
  };

  const clickRef = React.useRef("");

  useClickAway(clickRef, () => {
    if (emojiPickerActive) {
      setClickAwayOrigin(true);
      setEmojiPickerActive(false);
    } else setClickAwayOrigin(false);
  });

  const handleSendMessage = (e, message) => {
      e.preventDefault();
      props.handleSendMessage(message);
      setMessage("");
  }

  return (
    <div className="messageField">
      <input
        placeholder="Type a message"
        type="text"
        onKeyPress={(e) => (e.key === "Enter" ? handleSendMessage(e, message) : null)}
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        spellCheck="false"
      />

      <div
        ref={clickRef}
        className={classnames(
          "emojiPickerChat",
          emojiPickerActive ? "" : "hidden"
        )}
      >
        <EmojiPicker clickOnEmoji={clickOnEmoji} />
      </div>
      <div
        className={classnames(
          "emojiPickerButton",
          emojiPickerActive ? "active" : ""
        )}
        onClick={() => {
          if (clickAwayOrigin) {
            setEmojiPickerActive(false);
            setClickAwayOrigin(false);
          } else {
            emojiPickerActive
              ? setEmojiPickerActive(false)
              : setEmojiPickerActive(true);
          }
        }}
      >
        <InsertEmoticonIcon />
      </div>
      <div className="chessGameInvite"
      onClick={props.chessGameInvite}>
        C
      </div>

      <input
        className={classnames("", message === "" ? "" : "canSend")}
        type="submit"
        value="SEND"
        onClick={(e) => handleSendMessage(e, message)}
      />
    </div>
  );
}

export default MessageInput;
