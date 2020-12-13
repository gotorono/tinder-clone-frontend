import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Matches.css";
import axios from "../axios";
import { connect } from "react-redux";

function Matches(props) {
  const [matches, setMatches] = useState("");

  async function getMatches() {
    const req = await axios.get("/tinder/matches", {
      params: { user: props.auth.user.id },
    });
    setMatches(req.data);
  }

  useEffect(() => {
    getMatches();
  }, []);

  useEffect(() => {
    getMatches();
  }, [props.match]);


  return (
    <div className="matchesContainer">
      <div className="title">Your matches &#128293;</div>
      <div className="matchesFlexWrapper">
      {matches ? matches.map((person, index) => (
        <Link to={`/app/messages/${person._id}`}>
        <div className="match" key={index}>
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
      )) : null}
    </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Matches);
