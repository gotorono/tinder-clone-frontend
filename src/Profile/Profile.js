import React, { useEffect, useState } from "react";
import "./Profile.css";
import PropTypes from "prop-types";

import { useClickAway } from "use-click-away";

import classnames from "classnames";
import { updateUser } from "../actions/authActions";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import ClearIcon from "@material-ui/icons/Clear";
import AddIcon from "@material-ui/icons/Add";
import PersonIcon from "@material-ui/icons/Person";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Select from "react-select";
import { customStyles } from "../customStyles/select";

import { orientationOptions, genderOptions } from "../variables";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { sliderSettings } from "../sliderSettings";

import Slider from "react-slick";
import axios from "../axios";

import cryptoRandomString from "crypto-random-string";

import { storage } from "../firebase/firebase";

import Resizer from "react-image-file-resizer";

import { connect } from "react-redux";

function Profile(props) {
  const [user, setUser] = useState({});
  const [userImages, setUserImages] = useState([]);
  const [userImagesOptions, setUserImagesOptions] = useState([]);

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [canSetProfile, setCanSetProfile] = useState(true);

  const [errors, setErrors] = useState({});

  const [gender, setGender] = useState("");
  const [name, setName] = useState("");

  const [birthDate, setBirthDate] = useState("");
  const [orientation, setOrientation] = useState("");
  const [description, setDescription] = useState("");

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [clickAwayOrigin, setClickAwayOrigin] = useState(false);

  const clickRef = React.useRef("");

  useClickAway(clickRef, () => {
    if (calendarVisible) {
      setClickAwayOrigin(true);
      setCalendarVisible(false);
    } else setClickAwayOrigin(false);
  });

  async function fetchImgs() {
    const req = await axios.get("/tinder/users/imgs", {
      params: { user: props.auth.user.id },
    });
    let imgArray = [];
    for (let i = 0; i < 9; i++) {
      if (req.data[i]) imgArray.push(req.data[i]);
      else imgArray.push(null);
    }
    setUserImagesOptions(imgArray);
    setUserImages(req.data);
  }

  function birthDateClicked(e) {
    if (e !== null) {
      e.preventDefault();
    }

    if (clickAwayOrigin) {
      setCalendarVisible(false);
      setClickAwayOrigin(false);
    } else {
      calendarVisible ? setCalendarVisible(false) : setCalendarVisible(true);
    }
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
        }, 250)
      );
  }

  async function saveButtonHandler(e) {
    e.preventDefault();

    await axios
        .post("/tinder/users/updateProfile", {
         user: {
            id: user.id,
            name: name,
            description: description,
            gender: gender,
            orientation: orientation,
            birthDate: birthDate
          }
        })
    updateUser();


    showOptions(e);
  }

  function showOptions(e) {
    e.preventDefault();
    optionsOpen ? setOptionsOpen(false) : setOptionsOpen(true);
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
        }, 250)
      );
  };

  useEffect(() => {
    fetchImgs();
  }, []);

  useEffect(() => {
    setUser(props.auth.user);
    setGender(props.auth.user.gender);
    setOrientation(props.auth.user.orientation);
    setName(props.auth.user.name);
    setBirthDate(new Date(props.auth.user.birthDate));
    setDescription(props.auth.user.description);
    fetchImgs();
    if (props.errors) setErrors(props.errors);
  }, [props]);

  return (
    <div>
      <div className="cardContainer">
        <div className="swipe">
          <div
            className={classnames("card profile", optionsOpen ? "hidden" : "")}
          >
            <Slider {...sliderSettings}>
              {userImages.map((item, index) =>
                index === 0 ? (
                  <div className="itemWrapper" key={index}>
                    <div
                      style={{ backgroundImage: `url(${item})` }}
                      className="backgroundItem"
                    ></div>
                  </div>
                ) : (
                  <div className="itemWrapper" key={index}>
                    <div
                      style={{ backgroundImage: `url(${item.url})` }}
                      className="backgroundItem"
                    ></div>
                  </div>
                )
              )}
            </Slider>
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

          <div
            className={classnames(
              "optionsContainer",
              optionsOpen ? "" : "hidden"
            )}
          >
            <div className="closeOptionsButtonWrapper">
              <div className="fixedWrapper">
                <button
                  className="styled closeOptions"
                  onClick={(e) => saveButtonHandler(e)}
                >
                  <div className="flex-center">
                    {/* <span className="flex-center close">
                      <ClearIcon />
                    </span> */}
                    <span>Save</span>
                  </div>
                </button>
              </div>
            </div>
            <div className="imgItemsContainer">
              <div
                title="Current profile image"
                className="imgItem"
                style={{ backgroundImage: `url(${userImagesOptions[0]})` }}
              ></div>
              {userImagesOptions
                ? userImagesOptions.map((item, index) =>
                    index !== 0 ? (
                      item !== null ? (
                        <div
                          className="imgItem"
                          key={item.url}
                          style={{ backgroundImage: `url(${item.url})` }}
                        >
                          <div
                            className="profile-pic"
                            title="Set as profile picture"
                            onClick={(e) => setProfilePic(e, item.id, item.url)}
                          >
                            <PersonIcon />
                          </div>
                          <div
                            className="cross-delete"
                            title="Delete from gallery"
                            onClick={(e) => handleDelete(e, item.id)}
                          >
                            <ClearIcon />
                          </div>
                        </div>
                      ) : (
                        <label htmlFor="addImg" className="addImg" key={index}>
                          <div className="imgItem plus">
                            <div className="addIconWrapper">
                              <AddIcon />
                            </div>
                          </div>
                        </label>
                      )
                    ) : null
                  )
                : null}
              <input
                type="file"
                style={{ display: "none" }}
                id="addImg"
                onChange={handleImageAsFile}
              ></input>
            </div>
            <div className="settingsWrapper">
              {/* First name */}
              <div>
                <div>First name</div>
                <input
                  spellCheck="false"
                  className="styled"
                  type="text"
                  placeholder="First name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                ></input>
              </div>
              {/* Description */}
              <div className="descriptionWrapper">
                <div className="inputTitle">Description</div>

                <textarea
                  spellCheck="false"
                  rows="4"
                  className="styled"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              {/* Gender */}
              <div>
                <div className="inputTitle">Gender</div>

                <Select
                  className={classnames("", {
                    invalid: errors.gender,
                  })}
                  onChange={(e) => setGender(e.value)}
                  options={genderOptions}
                  isSearchable={false}
                  value={genderOptions.filter(
                    (option) => option.value === gender
                  )}
                  styles={customStyles}
                  placeholder="Select gender"
                />

                <div className="errorWrapper">
                  <span>{errors.gender}</span>
                </div>
              </div>
              {/* Orientation */}
              <div>
                <div className="inputTitle">Orientation</div>

                <Select
                  className={classnames("", {
                    invalid: errors.orientation,
                  })}
                  onChange={(e) => setOrientation(e.value)}
                  options={orientationOptions}
                  isSearchable={false}
                  value={orientationOptions.filter(
                    (option) => option.value === orientation
                  )}
                  styles={customStyles}
                  placeholder="Select orientation"
                />

                <div className="errorWrapper">
                  <span>{errors.orientation}</span>
                </div>
              </div>
              {/* Birth date */}
              <div className="birthDateWrapper">
                <div className="inputTitle">Birth date</div>

                <button
                  className={classnames(
                    calendarVisible ? "active" : "",
                    birthDate ? "active hasValue" : "placeholder",
                    errors.birthDate ? "invalid" : ""
                  )}
                  id="birthDateButton"
                  onClick={(e) => birthDateClicked(e)}
                >
                  <span className="textBirth">
                    {birthDate
                      ? birthDate.getDate() +
                        ". " +
                        (birthDate.getMonth() + 1) +
                        ". " +
                        birthDate.getFullYear()
                      : "Select birth date"}
                  </span>
                  <span
                    className={classnames(
                      "symbolsBirth",
                      calendarVisible ? "hover" : ""
                    )}
                  >
                    <span className="css-1okebmr-indicatorSeparator"></span>
                    <ExpandMoreIcon />
                  </span>
                </button>
                <Calendar
                  value={birthDate}
                  inputRef={clickRef}
                  onClickDay={() => birthDateClicked(null)}
                  className={classnames(calendarVisible ? "" : "hidden")}
                  onChange={(e) => setBirthDate(e)}
                  maxDate={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 18)
                    )
                  }
                  minDate={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 80)
                    )
                  }
                />

                <div className="errorWrapper">
                  <span>{errors.birthDate}</span>
                </div>
              </div>
              <div className="spacer-bottom"></div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <button className="styled" onClick={(e) => showOptions(e)}>
          Change
        </button>
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

export default connect(mapStateToProps, { updateUser })(Profile);
