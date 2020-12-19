import React, { useState, useEffect, useMemo } from "react";
import TinderCard from "react-tinder-card";
import "./TinderCards.css";
import axios from "./axios";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { sliderSettings } from "./sliderSettings";

import Slider from "react-slick";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

function TinderCards(props) {
  const [people, setPeople] = useState([]);

  let origin = "none";

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
  }

  function showPosition(position) {
    //console.log("Latitude: " + position.coords.latitude);
    //console.log("Longitude: " + position.coords.longitude);
  }

  getLocation();

  function handleEmpty(array) {
    console.log("hadnleEmpty");
    setTimeout(function () {
      if (array.length === 0) props.empty(true);
      else props.empty(false);
    }, 750);
  }

  function handleMatch(res) {
    if (props.matchFnc) {
      setTimeout(function () {
        props.matchFnc(res);
      }, 250);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    switch (props.refresh.swipe) {
      case "replay":
        break;
      case "left":
        swipe("left");
        break;
      case "star":
        swipe("right");
        break;
      case "right":
        swipe("right");
        break;
      case "lightning":
        break;
      default:
        break;
    }
  }, [props.refresh]);

  async function fetchData() {
    const req = await axios.get("/tinder/cards/get", {
      params: { user: props.auth.user.id },
    });
    setPeople(req.data);
    handleEmpty(req.data);
  }

  const childRefs = useMemo(
    () =>
      Array(100)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  const swipe = (dir) => {
    origin = "btn";
    if (people.length > 0) childRefs[people.length - 1].current.swipe(dir);
  };

  const swiped = (direction, user) => {
    let a = people;
    a.splice(
      a.findIndex((e) => e._id === user._id),
      1
    );
    setPeople(a);

    handleEmpty(a);

    let push;

    if (origin === "none") push = direction;
    else push = props.refresh.swipe;

    switch (push) {
      case "left":
        axios.post("/tinder/cards/push/left", {
          userId: props.auth.user.id,
          swipedId: user._id,
        });
        break;
      case "right":
        axios
          .post("/tinder/cards/push/right", {
            userId: props.auth.user.id,
            swipedId: user._id,
          })
          .then(function (data) {
            handleMatch(data.data);
          });
        break;
      case "star":
        axios
          .post("/tinder/cards/push/star", {
            userId: props.auth.user.id,
            swipedId: user._id,
          })
          .then(function (data) {
            handleMatch(data.data);
          });
        break;
      default:
        break;
    }

    origin = "none";
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
            <div className="card">
              <Slider {...sliderSettings}>
                <div className="itemWrapper">
                  <div
                    style={{ backgroundImage: `url(${person.profileImg})` }}
                    className="backgroundItem"
                  ></div>
                </div>
                {person.imgs.map((item, index) => (
                  <div className="itemWrapper" key={index}>
                    <div
                      style={{ backgroundImage: `url(${item.url})` }}
                      className="backgroundItem"
                    ></div>
                  </div>
                ))}
              </Slider>
              <div className="desc-container">
                <h3>
                  {person.name}
                  <span className="age">
                    {" "}
                    &nbsp;
                    {new Date().getFullYear() -
                      new Date(person.birthDate).getFullYear()}
                  </span>
                </h3>
                <div className="desc">{person.description}</div>
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

export default connect(mapStateToProps)(withRouter(TinderCards));
