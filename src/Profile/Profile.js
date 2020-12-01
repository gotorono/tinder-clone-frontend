import React, { useEffect, useState } from "react";
import "./Profile.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { logoutUser, deleteSwiped } from "../actions/authActions";
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

function Profile(props) {
  const [user, setUser] = useState({});
  const [userImages, setUserImages] = useState([]);
  const [imagesShown, setImagesShown] = useState(false);

  function onLogoutClick(e) {
    e.preventDefault();
    props.logoutUser();
  }

  function showImages(e) {
    e.preventDefault();

    imagesShown ? setImagesShown(false) : setImagesShown(true);
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
    setUserImages(props.auth.user.imgs);
  }, []);

  return (
    <div>
      <div>Profile Name is {user.name}</div>
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
      <div className="dropdownImagesWrapper">
        <div>
          <button
            className={classnames("dropdown", imagesShown ? "active" : "")}
            onClick={(e) => showImages(e)}
          >
            <span>Your images</span>
            <span className="symbolsBirth">
              <span className="css-1okebmr-indicatorSeparator"></span>
              <ExpandMoreIcon />
            </span>
          </button>
        </div>
        <div
          className={classnames("dropdownImages", imagesShown ? "" : "hidden")}
        >
          {userImages
            ? userImages.map((item, index) => (
                <div className="imgItem">{item}</div>
              ))
            : null}

          <label htmlFor="addImg" className="addImg">
            <div className="imgItem plus">
              <AddToPhotosIcon />
            </div>
          </label>
          <input type="file" style={{display: "none"}} id="addImg"></input>
        </div>
      </div>
    </div>
  );
}

Profile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser, deleteSwiped })(Profile);
