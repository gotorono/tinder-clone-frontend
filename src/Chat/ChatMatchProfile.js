import React, { useState, useEffect } from "react";
import "./ChatMatchProfile.css";

import axios from "../axios";

import { genderOptions } from "../variables";

import { IoIosMale } from "react-icons/io";
import { IoIosFemale } from "react-icons/io";

import { BsQuestionCircle } from "react-icons/bs";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { sliderSettings } from "../sliderSettings";

import Slider from "react-slick";

function ChatMatchProfile(props) {
  const [matchProfile, setMatchProfile] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);

  async function getProfile() {
    const req = await axios.get("/tinder/users/profile/get", {
      params: { _id: props.id },
    });
    setMatchProfile(req.data);
  }

  const genderHandler = () => {
    switch (matchProfile.gender) {
      case "M":
        return (
          <div className="gender">
            <IoIosMale /> Male
          </div>
        );
      case "F":
        return (
          <div className="gender">
            <IoIosFemale /> Female
          </div>
        );
      case "U":
        return (
          <div className="gender">
            <BsQuestionCircle /> Undefined
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    getProfile();
  }, [props.id]);

  return (
    <div className="chatMatchProfileWrapper">
      <div className="card">
        <Slider {...sliderSettings}>
          <div className="itemWrapper">
            <div
              style={{ backgroundImage: `url(${matchProfile.profileImg})` }}
              className="backgroundItem"
            ></div>
          </div>
          {matchProfile.imgs
            ? matchProfile.imgs.map((item, index) => (
                <div className="itemWrapper" key={index}>
                  <div
                    style={{ backgroundImage: `url(${item.url})` }}
                    className="backgroundItem"
                  ></div>
                </div>
              ))
            : null}
        </Slider>
      </div>
      <div className="desc-container">
        <div className="inside">
          <h3>
            {matchProfile.name}
            <span className="age">
              {" "}
              &nbsp;
              {new Date().getFullYear() -
                new Date(matchProfile.birthDate).getFullYear()}
            </span>
          </h3>
          {genderHandler()}
        </div>
        <div className="dividerLine" />
        <div className="inside">
          <div className="desc">{matchProfile.description}</div>
        </div>
      </div>
    </div>
  );
}

export default ChatMatchProfile;
