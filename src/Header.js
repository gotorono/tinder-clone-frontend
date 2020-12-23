import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import PersonIcon from "@material-ui/icons/Person";
import IconButton from "@material-ui/core/IconButton";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";

import { connect } from "react-redux";

function Header(props) {
  function handleClick(value) {
    if (props.route) {
      props.route(value);
    }
  }

  return (
    <div className="header">
      <Link to="/app/profile" title="My profile">
        <div className="profilePicWrapper">
          <div className="profilePic" style={{ backgroundImage: `url(${props.auth.user.profileImg})` }} onClick={() => handleClick("profile")}></div>
          <div className="borderNoBlur"></div>
          {/* <PersonIcon fontSize="large" className="header__icon" /> */}
        </div>
      </Link>

      <Link to="/app" title="Connections">
        <IconButton onClick={() => handleClick("matches")} className="appIcon">
          <img
            className="header__logo"
            src="https://1000logos.net/wp-content/uploads/2018/07/tinder-logo.png"
            alt=""
          />
        </IconButton>
      </Link>

      {window.location.pathname === "/app/profile" ? (
        <Link to="/app">
          <IconButton onClick={() => handleClick("messages")} title="Messages">
            <QuestionAnswerIcon fontSize="large" className="header__icon" />
          </IconButton>
        </Link>
      ) : (
        <IconButton onClick={() => handleClick("messages")} title="Messages">
          <QuestionAnswerIcon fontSize="large" className="header__icon" />
        </IconButton>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Header);
