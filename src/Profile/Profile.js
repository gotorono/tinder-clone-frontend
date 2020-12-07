import React, { useEffect, useState } from "react";
import "./Profile.css";
import PropTypes from "prop-types";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import Slider from 'react-slick';
import axios from "../axios";

import { updateUser } from "../actions/authActions";
import { connect } from "react-redux";

function Profile(props) {
  const [user, setUser] = useState({});
  const [userImages, setUserImages] = useState([]);
  
  let sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    accessibility: false,
    draggable: false,
    touchMove: false,
    slidesToScroll: 1,
    nextArrow: <ArrowForwardIosIcon />,
    prevArrow: <ArrowBackIosIcon />
  }

  async function fetchImgs() {
    const req = await axios.get("/tinder/users/imgs", {
      params: { user: props.auth.user.id },
    });
    setUserImages(req.data);
  }

  useEffect(() => {
    fetchImgs();
  }, [])

  useEffect(() => {
    setUser(props.auth.user);
    fetchImgs();
  }, [props]);

  return (
    <div>
      <div className="cardContainer">
        <div className="swipe">
          <div
            className="card profile"
          >
            <Slider {...sliderSettings}>
              {userImages.map( (item, index) => (
                index === 0 ? 
                  <div className="itemWrapper" key={index}>
                    <div style={{backgroundImage: `url(${item})` }} className="backgroundItem"></div>
                  </div>
                : 
                <div className="itemWrapper" key={index}>
                  <div style={{ backgroundImage: `url(${item.url})` }} className="backgroundItem"></div>
                </div>
              ) )}
            </Slider>
            <div className="desc-container">
              <h3>
                {user.name}
                <span className="age">
                  &nbsp;
                  {new Date().getFullYear() -
                    new Date(user.birthDate).getFullYear()}
                </span>
              </h3>
              <div className="desc">{user.description}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { updateUser })(Profile);
