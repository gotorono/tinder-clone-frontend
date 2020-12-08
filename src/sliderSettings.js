import React, { Component } from "react";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

import "./sliderSettings.css";

function NextArrow(props) {
  const {className, onClick} = props;

  return(
    <ArrowForwardIosIcon className={className} onClick={onClick} />
  );
}

function PrevArrow(props) {
  const {className, onClick} = props;

  return(
    <ArrowBackIosIcon className={className} onClick={onClick} />
  );
}

export const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  accessibility: false,
  draggable: false,
  touchMove: false,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />
};
