import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Matches.css";
import axios from "../axios";
import { connect } from "react-redux";

import classnames from "classnames";

import { socket } from "../socket";

function Matches(props) {
  const [matches, setMatches] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeChat, setActiveChat] = useState("");

  const [loadingMatches, setLoadingMatches] = useState(true);

  useEffect(() => {
    setActiveChat(props.activeChat);
  }, [props.activeChat]);

  useEffect(() => {
    setOnlineUsers(props.onlineUsers);
  }, [props.onlineUsers]);

  useEffect(() => {
    const getMatches = async() => {
      setLoadingMatches(true);
      const req = await axios.get("/tinder/cards/matches", {
        params: { user: props.auth.user.id },
      });
      setLoadingMatches(false);
      setMatches(req.data);
    }

    getMatches();
    socket.emit("getOnlineMatches", props.auth.user.id);
  }, [props.match, props.auth.user.id]);

  return (
    <div className="matchesContainer">
      {loadingMatches ? (
        <div className="loadingWrapperSidebar"><div className="loadbar" /></div>
      ) : (
        <div className="matchesFlexWrapper">
          {matches.length > 0
            ? matches.map((person, index) => (
                <Link to={`/app/messages/${person._id}`} key={person._id}>
                  <div
                    className={classnames(
                      "match",
                      activeChat === person._id ? "active" : null,
                      activeChat === undefined ? "" : "faded"
                    )}
                    title="Click to chat"
                  >
                    {onlineUsers.includes(person._id) ? (
                      <div className="online" title="User is online"></div>
                    ) : null}
                    <div
                      style={{ backgroundImage: `url(${person.profileImg})` }}
                      className="matchCard"
                    >
                      <div className="desc-container">
                        <h3>{person.name}</h3>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            : <div className="emptyList"><span className="up">You have no matches yet </span> <br /> <span className="down"><b>Swipe</b> to find a match!</span></div>}
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Matches);
