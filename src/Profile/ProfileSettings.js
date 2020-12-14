import React, { useEffect, useState } from "react";
import "./ProfileSettings.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, deleteSwiped } from "../actions/authActions";

function ProfileSettings(props) {
  const [user, setUser] = useState({});

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

  useEffect(() => {
    setUser(props.auth.user);
  }, []);

  return (
    <div>
      <div>
        <button className="styled" onClick={(e) => deleteSwipedFnc(e)}>
          Delete swiped
        </button>
      </div>
      <div>
        <button className="styled" onClick={(e) => onLogoutClick(e)}>
          Logout
        </button>
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
