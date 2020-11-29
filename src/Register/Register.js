import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import "./Register.css";
import { registerUser } from "../actions/authActions";

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Select from 'react-select';
import { customStyles } from '../customStyles/select';


import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import classnames from "classnames";

import Resizer from "react-image-file-resizer";

import cryptoRandomString from "crypto-random-string";

import { storage } from "../firebase/firebase";
import { Hidden } from "@material-ui/core";

function Register(props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [orientation, setOrientation] = useState("");

  const [imageURL, setImageURL] = useState("");
  const [imageBase64, setImageBase64] = useState();
  const [calendarVisible, setCalendarVisible] = useState(false);

  const [errors, setErrors] = useState({});

  function birthDateClicked(e) {

    e.preventDefault();

   calendarVisible ? setCalendarVisible(false) : setCalendarVisible(true);

  }

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
        .then(console.log("deleted"))
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
          console.log(snapShot);
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

  const selectOptions = [
    { value: 'M', label: 'Male' },
    { value: 'F', label: 'Female' },
    { value: 'U', label: 'Undefined' },
  ];
  
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
        <div className="profileImgWrapper" style={imageBase64 == null ? {display:"none"} : null}><div 
        style={{ backgroundImage: `url(${imageBase64})` }}></div></div>
</div>
        
        <div className="flexColumnWrapper">
          <div className="flexColumn" >
            <div style={{marginTop: 0}}>
              <div style={{marginTop: 0}} className="inputTitle">First name</div>
              <input
              autoComplete="new-password"
                onChange={(e) => setName(e.target.value)}
                value={name}
                error={errors.name}
                className={classnames("styled", { invalid: errors.name })}
                id="name"
                type="text"
              />
              <span>{errors.name}</span>
            </div>
            <div>
              <div className="inputTitle">Email address</div>
              <input
              autoComplete="new-password"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                error={errors.email}
                className={classnames("styled", { invalid: errors.email })}
                id="email"
                type="email"
              />
              <span>
                {errors.email}
                {errors.emailnotfound}
              </span>
            </div>
            <div style={{marginTop: 0}}>
            <div className="inputTitle">Gender</div>

              <Select 
              options={selectOptions}
              isSearchable={false}
              styles={customStyles}
              placeholder="Select gender" />

              <span>{errors.gender}</span>
            </div>
          </div>
          <div className="flexColumn">
            <div style={{marginTop: 0}}>
              <div style={{marginTop: 0}} className="inputTitle">Password</div>
              <input
              autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                error={errors.password}
                className={classnames("styled", { invalid: errors.password })}
                id="password"
                type="password"
              />
              <span>{errors.password}</span>
            </div>
            <div>
              <div className="inputTitle">Repeat your password</div>
              <input
              autoComplete="new-password"
                onChange={(e) => setPasswordRepeat(e.target.value)}
                value={passwordRepeat}
                error={errors.passwordRepeat}
                className={classnames("styled", { invalid: errors.passwordRepeat })}
                id="passwordRepeat"
                type="password"
              />
              <span>{errors.passwordRepeat}</span>
            </div>
            
          </div>

          <div className="flexColumn">
            
            <div className="birthDateWrapper">
              <button id="birthDateButton" onClick={(e) => birthDateClicked(e)}><span className="textBirth">Birth date</span> <span className="symbolsBirth"><span className="css-1okebmr-indicatorSeparator"></span><ExpandMoreIcon /></span></button>
              <Calendar
              className={classnames(calendarVisible ? "" : "hidden")}
               onChange={(e) => setBirthDate(e)} 
               maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
               minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 80))}
               defaultActiveStartDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
               />
              
              <span>{errors.birthDate}</span>
            </div>
          </div>

          <div className="buttonLast">
              <button type="submit" className="styled" id="signUp">Sign Up</button>
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
