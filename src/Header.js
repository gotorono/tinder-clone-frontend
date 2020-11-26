import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import PersonIcon from "@material-ui/icons/Person";
import IconButton from "@material-ui/core/IconButton";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";

function Header(props) {

  function handleClick(value) {
    if(props.route) {
        props.route(value);
    }
}

  return (
    <div className="header">
        <IconButton onClick={() => handleClick('profile')}>
          <PersonIcon fontSize="large" className="header__icon" />
        </IconButton>

        <IconButton onClick={() => handleClick('matches')}>
          <img
            className="header__logo"
            src="https://1000logos.net/wp-content/uploads/2018/07/tinder-logo.png"
            alt=""
          />
        </IconButton>

        <IconButton onClick={() => handleClick('messages')}>
          <QuestionAnswerIcon fontSize="large" className="header__icon" />
        </IconButton>
    </div>
  );
}

export default Header;
