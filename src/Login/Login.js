import React, { useState, useEffect } from "react";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import "./Login.css";
import PropTypes from 'prop-types';
import { loginUser } from '../actions/authActions';
import classnames from 'classnames';

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if(props.auth.isAuthenticated) {
      props.history.push('/app');
    }
  });

  useEffect(() => {
    if(props.errors) {
      setErrors(props.errors);
    }
  }, [props])

  function onSubmit(e) {
    e.preventDefault();

    const userData = {
      email: email,
      password: password
    };

    props.loginUser(userData);
  };


  return (
    <div>
      <form noValidate onSubmit={onSubmit}>
        <div>
          Email
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            error={errors.email}
            className={classnames("", {invalid: errors.email})}
            id="email"
            type="email"
          />
          <span>{errors.email}</span>
        </div>
        <div>
          Password
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            error={errors.password}
            className={classnames("", {invalid: errors.password})}
            id="password"
            type="password"
          />
          <span>{errors.password}</span>
        </div>
        <div><button type="submit">Sign In</button></div>
      </form>
    </div>
  );
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
})


export default connect(mapStateToProps, { loginUser })(withRouter(Login));
