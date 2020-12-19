import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Matches.css";
import axios from "../axios";
import { connect } from "react-redux";

import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import { socket } from "../socket";

function Matches(props) {
  const [matches, setMatches] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    setOnlineUsers(props.onlineUsers);
  }, [props.onlineUsers]);

  async function getMatches() {
    const req = await axios.get("/tinder/cards/matches", {
      params: { user: props.auth.user.id },
    });
    setMatches(req.data);
  }

  useEffect(() => {
    getMatches();
    socket.emit('getOnlineMatches', props.auth.user.id);
  }, []);

  useEffect(() => {
    getMatches();
  }, [props.match]);


  return (
    <div className="matchesContainer">
      <div className="title">Your matches &#128293;</div>
      <div className="matchesFlexWrapper">
        {matches
          ? matches.map((person, index) => (
              <Link to={`/app/messages/${person._id}`} key={person._id}>
                <div className="match" title="Click to chat">
                  {onlineUsers.includes(person._id) ? <div className="online" title="User is online"></div> : null}
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
          : null}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Matches);
