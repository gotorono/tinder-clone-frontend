import React from "react"
import { Link } from "react-router-dom"
import "./Header.css"
import IconButton from "@material-ui/core/IconButton"

import Logo from "./img/logo.png"

import { connect } from "react-redux"

function Header(props) {
  return (
    <div className="header">
      <Link to="/app/profile" title="My profile">
        <div className="flexProfileWrapper">
          <div className="profilePicWrapper">
            <div
              className="profilePic"
              style={{ backgroundImage: `url(${props.auth.user.profileImg})` }}
            ></div>
            <div className="borderNoBlur"></div>
          </div>
          <div className="titleProfile">My profile</div>
        </div>
      </Link>

      <Link to="/app" title="Connections">
        <img className="header__logo" src={Logo} alt="" />
      </Link>
    </div>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(Header)
