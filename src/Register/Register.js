import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import "./Register.css";
import { registerUser } from "../actions/authActions";

import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import classnames from "classnames";

import Resizer from "react-image-file-resizer";

import cryptoRandomString from "crypto-random-string";

import { storage } from "../firebase/firebase";

function Register(props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const [imageURL, setImageURL] = useState("");
  const [imageBase64, setImageBase64] = useState();

  const [errors, setErrors] = useState({});

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

    if (imageBase64 === "") {
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

  return (
    <div className="registerWrapper">
      <form noValidate onSubmit={onSubmit}>

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
              <div style={{marginTop: 0}}>First name</div>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                error={errors.name}
                className={classnames("", { invalid: errors.name })}
                id="name"
                type="text"
              />
              <span>{errors.name}</span>
            </div>
            <div>
              <div>Email address</div>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                error={errors.email}
                className={classnames("", { invalid: errors.email })}
                id="email"
                type="email"
              />
              <span>
                {errors.email}
                {errors.emailnotfound}
              </span>
            </div>
          </div>
          <div className="flexColumn">
            <div>
              <div>Password</div>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                error={errors.password}
                className={classnames("", { invalid: errors.password })}
                id="password"
                type="password"
              />
              <span>{errors.password}</span>
            </div>
            <div>
              <div>Repeat your password</div>
              <input
                onChange={(e) => setPasswordRepeat(e.target.value)}
                value={passwordRepeat}
                error={errors.passwordRepeat}
                className={classnames("", { invalid: errors.passwordRepeat })}
                id="passwordRepeat"
                type="password"
              />
              <span>{errors.passwordRepeat}</span>
            </div>
          </div>
          <div className="buttonLast">
              <button type="submit" id="signUp">Sign Up</button>
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
