import React from "react";
import "./ProfileSettings.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, deleteSwiped } from "../actions/authActions";

function ProfileSettings(props) {
  function onLogoutClick(e) {
    e.preventDefault();
    props.logoutUser();
  }

  function deleteSwipedFnc(e) {
    e.preventDefault();
    const userData = {
      user: props.auth.user,
    };
    props.deleteSwiped(userData);
  }

  return (
    <div className="profileSettings">
      <div className="profileSettingsItemsWrapper">
        <div className="profileSettingsItem" onClick={(e) => deleteSwipedFnc(e)}>
          <span>WIP: Delete swiped</span>
        </div>
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
  deleteSwiped,
})(ProfileSettings);
