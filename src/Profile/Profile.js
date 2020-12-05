import React, { useEffect, useState } from "react";
import "./Profile.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";

function Profile(props) {
  const [user, setUser] = useState({});

  useEffect(() => {
    setUser(props.auth.user);
  }, []);

  return (
    <div className="cardContainer">
      <div className="swipe">
        <div
          className="card"
          style={{ backgroundImage: `url(${user.profileImg})` }}
        >
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
  );
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Profile);
