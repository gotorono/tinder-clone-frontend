import React, { useState, useEffect } from "react";
import TinderCard from "react-tinder-card";
import "./TinderCards.css";
import { updateUser, getCards } from "./actions/authActions";
import axios from "./axios";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

function TinderCards(props) {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    console.log(props.auth.user.cards);
    console.log(props.auth.user.swiped);

    updateUser();
  }, []);

  async function fetchData() {
    const req = await axios.get("/tinder/cards", {
      params: { user: props.auth.user.id },
    });
    setPeople(req.data);
  }

  async function updateUser() {
    const userData = {
      user: props.auth.user,
    };

    await props.updateUser(userData);
    fetchData();
  }

  const swiped = (direction, user) => {
      let a = people;
      a.splice(a.findIndex(e => e._id === user._id), 1);
      setPeople(a);
    async function push() {
      await axios
        .post("/tinder/push", {
          userId: props.auth.user.id,
          swipedId: user._id,
        })
        .then(people.length < 2 ? updateUser() : null);
    }
    push();
  };

  const outOfFrame = (name) => {
    console.log(name + " has left the screen");
  };

  return (
    <div className="tinderCards">
      <div className="tinderCards__cardContainer">
        {people.map((person) => (
          <TinderCard
            className="swipe"
            key={person._id}
            preventSwipe={["up", "down"]}
            onSwipe={(dir) => swiped(dir, person)}
            onCardLeftScreen={() => outOfFrame(person.name)}
          >
            <div
              style={{ backgroundImage: `url(${person.profileImg})` }}
              className="card"
            >
              <div className="desc-container">
                <h3>
                  {person.name}
                  <span className="age"> &nbsp;{person.age}</span>
                </h3>
                <div className="desc">{person.desc}</div>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { updateUser })(
  withRouter(TinderCards)
);
