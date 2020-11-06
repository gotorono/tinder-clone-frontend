import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import PersonIcon from "@material-ui/icons/Person";
import IconButton from "@material-ui/core/IconButton";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";

function Header() {
  return (
    <div className="header">
      <Link to="/profile">
        <IconButton>
          <PersonIcon fontSize="large" className="header__icon" />
        </IconButton>
      </Link>

      <Link to="/">
        <IconButton>
          <img
            className="header__logo"
            src="https://1000logos.net/wp-content/uploads/2018/07/tinder-logo.png"
            alt=""
          />
        </IconButton>
      </Link>

      <Link to="/messages">
        <IconButton>
          <QuestionAnswerIcon fontSize="large" className="header__icon" />
        </IconButton>
      </Link>
    </div>
  );
}

export default Header;
