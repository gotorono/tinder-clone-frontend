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
    socket.on('sendOnlineMatches', (onlineUsers) => {
      setOnlineUsers(onlineUsers)
    })

    socket.on("online", (userId) => {
      setOnlineUsers([...new Set([...onlineUsers, userId])]);
    });

    socket.on("offline", (userId) => {
      setOnlineUsers(onlineUsers.filter(id => id !== userId));
    })

    return () => {
      socket.off();
    };

  }, [onlineUsers]);

  console.log(onlineUsers);

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

  console.log(matches);

  return (
    <div className="matchesContainer">
      <div className="title">Your matches &#128293;</div>
      <div className="matchesFlexWrapper">
        {matches
          ? matches.map((person, index) => (
              <Link to={`/app/messages/${person._id}`} key={person._id}>
                <div className="match">
                  {onlineUsers.includes(person._id) ? <div className="online"></div> : null}
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
