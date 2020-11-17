import React, {useEffect, useState}from "react";
import Header from "../Header";
import "./Profile.css";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { logoutUser, deleteSwiped } from "../actions/authActions"; 

function Profile(props) {
  
  function onLogoutClick(e) {
    e.preventDefault();
    props.logoutUser();
  }

  function deleteSwipedFnc(e) {
    e.preventDefault();
    const userData = {
      user: props.auth.user
    }
    props.deleteSwiped(userData);
  }

  const [user, setUser] = useState({});


  useEffect(() => {
    setUser(props.auth.user);
  }, [])

  return (
    <div>
      <Header />
    <div>Profile Name is {user.name}</div>
    <div><button onClick={(e) => deleteSwipedFnc(e)}>Delete swiped</button></div>
    <div><button onClick={(e) => onLogoutClick(e)}>Logout</button></div>
    </div>
  );
}

Profile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, { logoutUser, deleteSwiped })(Profile);
