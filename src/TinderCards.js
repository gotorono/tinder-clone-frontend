import React, { useState, useEffect, useMemo } from "react";
import TinderCard from "react-tinder-card";
import "./TinderCards.css";
import { updateUser } from "./actions/authActions";
import axios from "./axios";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Update } from "@material-ui/icons";

function TinderCards(props) {
  const [people, setPeople] = useState([]);

  let origin = 'none';

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
  }
  
  function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude);
    console.log("Longitude: " + position.coords.longitude);
  }

  getLocation();

  function handleMatch(res) {
    if(props.matchFnc) {
      setTimeout(function() {
        props.matchFnc(res);
      }, 500)
    }
  }

  useEffect(() => {
    updateUser();
    
  }, []);

  useEffect(() => {
    switch (props.refresh.swipe) {
      case "replay":
        return;
      case "left":
        swipe("left");
        return;
      case "star":
        swipe("right");
        return;
      case "right":
        swipe("right");
      case "lightning":
        return;
    }
  }, [props.refresh]);

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

  const childRefs = useMemo(
    () =>
      Array(10)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  const swipe = (dir) => {
    origin = 'btn';
    if (people.length > 0) childRefs[people.length - 1].current.swipe(dir);
  };

  const swiped = (direction, user) => {
    let a = people;
    a.splice(
      a.findIndex((e) => e._id === user._id),
      1
    );
    setPeople(a);

    let push;

    if(origin == 'none') 
      push = direction
    else 
      push = props.refresh.swipe;
    

    switch (push) {
      case "left":
        axios.post("/tinder/push/left", {
          userId: props.auth.user.id,
          swipedId: user._id,
        })
        break;
      case "right":
        axios.post("/tinder/push/right", {
          userId: props.auth.user.id,
          swipedId: user._id,
        }).then(function(data) {
          handleMatch(data.data);
        });
        break;
      case "star":
        axios.post("/tinder/push/star", {
          userId: props.auth.user.id,
          swipedId: user._id,
        }).then(function(data) {
          handleMatch(data.data);
        });
        break;
      default:
        break;
    }
    //if(people.length < 2)
    //updateUser();

    origin = 'none';
  };

  const outOfFrame = (name) => {
    console.log(name + " has left the screen");
  };

  return (
    <div className="tinderCards">
      <div className="tinderCards__cardContainer">
        {people.map((person, index) => (
          <TinderCard
            ref={childRefs[index]}
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
