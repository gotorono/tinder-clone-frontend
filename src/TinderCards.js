import React, { useState, useEffect, useCallback, useRef } from "react";
import TinderCard from "./TinderCard/TinderCard";
import "./TinderCards.css";
import axios from "./axios";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { sliderSettings } from "./sliderSettings";

import classnames from "classnames";

import Slider from "react-slick";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import MatchAnimation from "./MatchAnimation";

import CancelIcon from "@material-ui/icons/Cancel";

function TinderCards(props) {
  const [people, setPeople] = useState([]);
  const [playAnimation, setPlayAnimation] = useState(false);
  const [newMatch, setNewMatch] = useState({});
  const [origin, setOrigin] = useState("none");

  const cardRefs = React.useMemo(
    () => Array.from({ length: people.length }, () => React.createRef()),
    [people.length]
  );

  // function getLocation() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(showPosition);
  //   }
  // }

  // function showPosition(position) {
  //   //console.log("Latitude: " + position.coords.latitude);
  //   //console.log("Longitude: " + position.coords.longitude);
  // }

  // getLocation();

  const handleEmpty = useCallback((array) => {
    setTimeout(function () {
      if (array.length === 0) props.empty(true);
      else props.empty(false);
    }, 750);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMatch = (res) => {
    if (props.matchFnc) {
      setTimeout(function () {
        if (res) {
          playMatchAnimation(res);
          setNewMatch(res.user);
          props.matchFnc(res);
        } else {
          handleEmpty(people);
        }
      }, 500);
    }
  };

  useEffect(() => {
    if (people.length === 0) if (playAnimation === false) handleEmpty(people);
  }, [playAnimation, handleEmpty, people]);

  const playMatchAnimation = () => {
    setPlayAnimation(true);
  };

  useEffect(() => {
    async function fetchData() {
      const req = await axios.get("/tinder/cards/get", {
        params: { user: props.auth.user.id },
      });
      setPeople(req.data);
      handleEmpty(req.data);
    }

    fetchData();
  }, [handleEmpty, props.auth.user.id, props.forceUpdate]);

  useEffect(() => {
    const swipe = (dir) => {
      setOrigin("btn");
      if (people.length > 0) {
        cardRefs[people.length - 1].current.swipe(dir);
        swiped(dir, people[people.length - 1]);
      }
    };

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
  }, [props.refresh, people.length, cardRefs]);

  const swiped = (direction, user) => {
    let a = people;
    a.splice(
      a.findIndex((e) => e._id === user._id),
      1
    );
    setPeople(a);

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

    setOrigin("none");
  };

  return (
    <div className="tinderCards">
      <div className="tinderCards__cardContainer">
        <div
          className={classnames(
            "newMatchWrapper",
            playAnimation === true ? "active" : ""
          )}
        >
          <div className="newMatchContainer">
            {Object.keys(newMatch).length !== 0 &&
            newMatch.constructor === Object ? (
              <div className="swipe newMatch">
                <div
                  className="closeNewMatch"
                  onClick={() => setPlayAnimation(false)}
                >
                  <CancelIcon />
                </div>
                <div className="card">
                  <Slider {...sliderSettings}>
                    <div className="itemWrapper">
                      <div
                        style={{
                          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.125), rgba(0, 0, 0, 0.75)), url(${newMatch.profileImg})`,
                        }}
                        className="backgroundItem"
                      >
                        <MatchAnimation
                          play={playAnimation}
                          name={newMatch.name}
                          to={newMatch._id}
                          close={() => setPlayAnimation(false)}
                        />
                      </div>
                    </div>
                    {newMatch.imgs.map((item, index) => (
                      <div className="itemWrapper" key={index}>
                        <div
                          style={{
                            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.125), rgba(0, 0, 0, 0.75)), url(${item.url})`,
                          }}
                          className="backgroundItem"
                        ></div>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        {people.map((person, index) => (
          <TinderCard
            ref={cardRefs[index]}
            onSwipe={(dir) => swiped(dir, person)}
            key={person._id}
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
                    {Math.abs(new Date(Date.now() - new Date(person.birthDate).getTime()).getUTCFullYear() - 1970)}
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
