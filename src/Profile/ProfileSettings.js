import React from "react";
import "./ProfileSettings.css";

import axios from '../axios';

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";

function ProfileSettings(props) {
  function onLogoutClick(e) {
    e.preventDefault();
    props.logoutUser();
  }

  // function deleteAll(e) {
  //   e.preventDefault();
  //   axios.post("tinder/cards/delete/all").then(() => {
  //     console.log("Deleted");
  //   })
  // }

  function deleteSwiped(e) {
    e.preventDefault();
    axios.post("tinder/cards/delete/swiped", {id: props.auth.user.id}).then(() => {
      console.log("Deleted");
    })
  }

  return (
    <div className="profileSettings">
      <div className="profileSettingsItemsWrapper">
        <div className="profileSettingsItem" onClick={(e) => deleteSwiped(e)}>
          <span>WIP: Delete swiped</span>
        </div>
        {/* <div className="profileSettingsItem" onClick={(e) => deleteAll(e)}>
          <span>WIP: Delete all</span>
        </div> */}
        <div className="profileSettingsItem"  onClick={(e) => onLogoutClick(e)}>
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}

ProfileSettings.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  logoutUser,
})(ProfileSettings);
