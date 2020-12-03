import React, { useEffect, useState } from "react";
import "./ProfileSettings.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { updateUser, logoutUser, deleteSwiped } from "../actions/authActions";
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';

import axios from '../axios';

import cryptoRandomString from "crypto-random-string";

import { storage } from "../firebase/firebase";

import Resizer from "react-image-file-resizer";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

function ProfileSettings(props) {
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

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        600,
        1200,
        "JPEG",
        90,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

    async function uploadImg(imgURL) {
        await axios.post("/tinder/users/uploadimg", {
            id: user.id,
            img: imgURL
        });

        updateUser();
    }

  const handleImageAsFile = async (e) => {
    const image = await resizeFile(e.target.files[0]);
    if (image == null) {
        console.error("not an image");
      } else {
        const rnd = cryptoRandomString({ length: 32, type: "base64" });
        const uploadTask = storage
          .ref(`/images/${rnd}`)
          .putString(image, "data_url", { contentType: "image/jpeg" });
  
        uploadTask.on(
          "state_changed",
          (snapShot) => {
            //console.log(snapShot);
          },
          (err) => {
            console.log(err);
          },
          () => {
            storage
              .ref("images")
              .child(rnd)
              .getDownloadURL()
              .then((fireBaseUrl) => {
                uploadImg(fireBaseUrl);
              });
          }
        );
      }
  };

  function deleteSwipedFnc(e) {
    e.preventDefault();
    const userData = {
      user: props.auth.user,
    };
    props.deleteSwiped(userData);
  }



  useEffect(() => {
    updateUser();
    setUser(props.auth.user);
    setUserImages(props.auth.user.imgs);
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
            <div className="imgItem" style={{ backgroundImage: `url(${user.profileImg})` }}></div>
          {userImages
            ? userImages.map((item, index) => (
                <div className="imgItem" key={index} style={{ backgroundImage: `url(${item})` }}></div>
              ))
            : null}

          <label htmlFor="addImg" className="addImg">
            <div className="imgItem plus">
              <AddToPhotosIcon />
            </div>
          </label>
          <input type="file" style={{display: "none"}} id="addImg" onChange={handleImageAsFile}></input>
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

export default connect(mapStateToProps, { updateUser, logoutUser, deleteSwiped })(ProfileSettings);
