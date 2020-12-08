import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import "./Register.css";
import { registerUser } from "../actions/authActions";

import { useClickAway } from "use-click-away";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Select from "react-select";
import { customStyles } from "../customStyles/select";

import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import classnames from "classnames";

import Resizer from "react-image-file-resizer";

import { orientationOptions, genderOptions } from '../variables';

import cryptoRandomString from "crypto-random-string";

import { storage } from "../firebase/firebase";

function Register(props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [orientation, setOrientation] = useState("");
  const [description, setDescription] = useState("");

  const [imageURL, setImageURL] = useState("");
  const [imageBase64, setImageBase64] = useState();

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [clickAwayOrigin, setClickAwayOrigin] = useState(false);

  const [errors, setErrors] = useState({});

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

  const clickRef = React.useRef("");

  useClickAway(clickRef, () => {
    if (calendarVisible) {
      setClickAwayOrigin(true);
      setCalendarVisible(false);
    } else setClickAwayOrigin(false);
  });

  useEffect(() => {
    if (props.auth.isAuthenticated) {
      props.history.push("/app");
    }
  });

  useEffect(() => {
    if (props.errors) {
      storage
        .ref("images")
        .child(imageURL)
        .delete()
        .catch(function (err) {
          console.log(err);
        });
      setErrors(props.errors);
    }
  }, [props]);

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

  const handleImageAsFile = async (e) => {
    const image = await resizeFile(e.target.files[0]);
    setImageBase64(image);
  };

  function onSubmit(e) {
    e.preventDefault();

    const newUser = {
      name: name,
      email: email,
      password: password,
      passwordRepeat: passwordRepeat,
      gender: gender,
      orientation: orientation,
      birthDate: birthDate,
      description: description
    };

    if (imageBase64 == null) {
      console.error("not an image");
    } else {
      const rnd = cryptoRandomString({ length: 32, type: "base64" });
      const uploadTask = storage
        .ref(`/images/${rnd}`)
        .putString(imageBase64, "data_url", { contentType: "image/jpeg" });

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
              newUser.profileImg = fireBaseUrl;
              setImageURL(rnd);
              props.registerUser(newUser, props.history);
            });
        }
      );
    }
  }

  return (
    <div className="registerWrapper">
      <form noValidate autoComplete="new-password" onSubmit={onSubmit}>
        <div className="profileImgHeadWrapper">
          <div className="profileImgUploadWrapper">
            <label htmlFor="profileImg" className="profileImg">
              <div className="profileImgUpload">
                <span className="uploadIcon">
                  <CloudUploadIcon />
                </span>
                Your profile image
              </div>
            </label>
            <input type="file" id="profileImg" onChange={handleImageAsFile} />
          </div>
          <div
            className="profileImgWrapper"
            style={imageBase64 == null ? { display: "none" } : null}
          >
            <div style={{ backgroundImage: `url(${imageBase64})` }}></div>
          </div>
        </div>

        <div className="flexColumnWrapper">
          <div className="flexColumn">
            <div >
              <div className="inputTitle">First name</div>
              <input
              spellCheck="false"
                autoComplete="new-password"
                onChange={(e) => setName(e.target.value)}
                value={name}
                error={errors.name}
                className={classnames("styled", { invalid: errors.name })}
                id="name"
                type="text"
              />
              <div className="errorWrapper">
                <span>{errors.name}</span>
              </div>
            </div>
            <div>
              <div className="inputTitle">Email address</div>
              <input
              spellCheck="false"
                autoComplete="new-password"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                error={errors.email}
                className={classnames("styled", { invalid: errors.email })}
                id="email"
                type="email"
              />
              <div className="errorWrapper">
                <span>
                  {errors.email}
                  {errors.emailnotfound}
                </span>
              </div>
            </div>

            <div className="flexbasis100"></div>

            <div>
              <div className="inputTitle">Password</div>
              <input
              spellCheck="false"
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                error={errors.password}
                className={classnames("styled", { invalid: errors.password })}
                id="password"
                type="password"
              />
              <div className="errorWrapper">
                <span>{errors.password}</span>
              </div>
            </div>
            <div>
              <div className="inputTitle">Repeat your password</div>
              <input
              spellCheck="false"
                autoComplete="new-password"
                onChange={(e) => setPasswordRepeat(e.target.value)}
                value={passwordRepeat}
                error={errors.passwordRepeat}
                className={classnames("styled", {
                  invalid: errors.passwordRepeat,
                })}
                id="passwordRepeat"
                type="password"
              />
              <div className="errorWrapper">
                <span>{errors.passwordRepeat}</span>
              </div>
            </div>
          </div>
          <div className="flexbasis100"></div>
          <div className="flexColumn">
            <div>
              <div className="inputTitle">Gender</div>

              <Select
                className={classnames("", {
                  invalid: errors.gender,
                })}
                onChange={(e) => setGender(e.value)}
                options={genderOptions}
                isSearchable={false}
                styles={customStyles}
                placeholder="Select gender"
              />

              <div className="errorWrapper">
                <span>{errors.gender}</span>
              </div>
            </div>
            <div>
              <div className="inputTitle">Orientation</div>

              <Select
                className={classnames("", {
                  invalid: errors.orientation,
                })}
                onChange={(e) => setOrientation(e.value)}
                options={orientationOptions}
                isSearchable={false}
                styles={customStyles}
                placeholder="Select orientation"
              />

              <div className="errorWrapper">
                <span>{errors.orientation}</span>
              </div>
            </div>
            <div className="flexbasis100"></div>

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
                defaultActiveStartDate={
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() - 18)
                  )
                }
              />

              <div className="errorWrapper">
                <span>{errors.birthDate}</span>
              </div>
            </div>
            <div className="descriptionWrapper">
              <div className="inputTitle">Description</div>

              <textarea
                spellCheck="false"
                rows="4"
                className="styled"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us something about yourself"
              ></textarea>
            </div>
          </div>

          <div className="buttonLast flexbasis100">
            <button type="submit" className="styled" id="signUp">
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));
