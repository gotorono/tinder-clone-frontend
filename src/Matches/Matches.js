import React, { useEffect, useState } from "react";
import "./Matches.css";
import axios from "../axios";
import { connect } from "react-redux";

function Matches(props) {
  const [matches, setMatches] = useState();

  useEffect(() => {
    async function getMatches() {
      const req = await axios.get("/tinder/matches", {
        params: { user: props.auth.user.id },
      });
      setMatches(req.data);
    }
    getMatches();
  }, []);


  return (
    <div className="matchesContainer">
      {matches ? matches.map((person, index) => (
        <div className="match">
          <div
            style={{ backgroundImage: `url(${person.profileImg})` }}
            className="matchCard"
          >
            <div className="desc-container">
              <h3>{person.name}</h3>
            </div>
          </div>
        </div>
      )) : null}
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Matches);
