import React, { useState, useEffect } from "react";
import "./MatchAnimation.css";

import classnames from "classnames";

import { socket } from "./socket";

import { connect } from "react-redux";

import FavoriteIcon from "@material-ui/icons/Favorite";

import { getMatchString } from "./variables";


function MatchAnimation(props) {
  const [message, setMessage] = useState("");
  const [matchString, setMatchString] = useState("");

  useEffect(() => {
    if (props.to !== "")
      getMatchString(props.auth.user.id, props.to).then((data) =>
        setMatchString(data)
      );
      setMessage("");
  }, [props.to, props.auth.user.id]);

  const handleSendMessage = () => {
    if (message !== "") {
      socket.emit("message", {
        from: props.auth.user.id,
        to: props.to,
        matchString,
        message,
        origin: props.auth.user.id,
      });
      props.close();
    }
  };

  return (
    <div
      className={classnames(
        "matchAnimation",
        props.play === true ? "play" : ""
      )}
    >
      <div className="animatedTextWrapper">
        <div className="animatedText">
          IT'S A <br /> <span>MATCH!</span>
        </div>
        <div className="animatedTextAbsolute">MATCH!</div>
        <div className="animatedTextAbsolute second">MATCH!</div>
      </div>
      <div className="bottomNewMatch">
        <div className="connected">You and {props.name} are now connected!</div>
        <div className="heart">
          <FavoriteIcon />
        </div>
        <div className="firstMessage">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Say something nice"
          />
          <button onClick={handleSendMessage}>SEND</button>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(MatchAnimation);
