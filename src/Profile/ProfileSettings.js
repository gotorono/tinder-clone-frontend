import React, { useEffect, useState } from "react";
import "./ProfileSettings.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, deleteSwiped, updateUser } from "../actions/authActions";

import axios from "../axios";

import cryptoRandomString from "crypto-random-string";

import { storage } from "../firebase/firebase";

import Resizer from "react-image-file-resizer";


function ProfileSettings(props) {
  const [user, setUser] = useState({});
  const [userImages, setUserImages] = useState([]);
  const [imagesShown, setImagesShown] = useState(false);
  const [canSetProfile, setCanSetProfile] = useState(true);

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

  function uploadImg(imgURL) {
    axios
      .post("/tinder/users/imgs/upload", {
        id: user.id,
        img: imgURL,
      })
      .then(
        setTimeout(function () {
          fetchImgs();
          updateUser();
        }, 250)
      );
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

  function updateUser() {
    const userData = {
      user: props.auth.user,
    };
    props.updateUser(userData);
  }

  function deleteSwipedFnc(e) {
    e.preventDefault();
    const userData = {
      user: props.auth.user,
    };
    props.deleteSwiped(userData);
  }

  async function fetchImgs() {
    const req = await axios.get("/tinder/users/imgs", {
      params: { user: props.auth.user.id },
    });
    setUserImages(req.data);
  }

  const setProfilePic = (e, imgID, url) => {
    if (canSetProfile === true) {
      setCanSetProfile(false);
      axios
        .post("/tinder/users/imgs/setprofile", {
          id: user.id,
          imgID: imgID,
          url: url,
        })
        .then(() => {
          setTimeout(function () {
            fetchImgs();
          }, 500);
          setTimeout(function () {
            updateUser();
            setCanSetProfile(true);
          }, 1000);
        });
    }
  };

  const handleDelete = (e, imgID) => {
    axios
      .post("/tinder/users/imgs/delete", {
        id: user.id,
        imgID: imgID,
      })
      .then(
        setTimeout(function () {
          fetchImgs();
          updateUser();
        }, 250)
      );
  };

  useEffect(() => {
    setUser(props.auth.user);
    fetchImgs();
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
  updateUser
})(ProfileSettings);
