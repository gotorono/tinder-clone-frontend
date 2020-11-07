import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from 'prop-types';
import "./Register.css";
import { registerUser } from "../actions/authActions";
import classnames from "classnames";

function Register(props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if(props.auth.isAuthenticated) {
      props.history.push('/profile');
    }
  });

  useEffect(() => {
    if(props.errors) {
      setErrors(props.errors);
    }
  }, [props])

  function onSubmit(e) {
    e.preventDefault();

    const newUser = {
      name: name,
      email: email,
      password: password,
      passwordRepeat: passwordRepeat,
    };

    props.registerUser(newUser, props.history);
  };

  return (
    <div>
      <form noValidate onSubmit={onSubmit}>
        <div>
          Name
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            error={errors.name}
            id="name"
            type="text"
          />
          <span>{errors.name}</span>
        </div>
        <div>
          Email
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            error={errors.email}
            id="email"
            type="email"
          />
          <span>{errors.email}{errors.emailnotfound}</span>
        </div>
        <div>
          Password
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            error={errors.password}
            id="password"
            type="password"
          />
          <span>{errors.password}</span>
        </div>
        <div>
          Password repeat
          <input
            onChange={(e) => setPasswordRepeat(e.target.value)}
            value={passwordRepeat}
            error={errors.passwordRepeat}
            id="passwordRepeat"
            type="password"
          />
          <span>{errors.passwordRepeat}</span>
        </div>
        <div><button type="submit">Sign Up</button></div>
      </form>
    </div>
  );
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
})

export default connect(
  mapStateToProps,
  { registerUser })(withRouter(Register));
