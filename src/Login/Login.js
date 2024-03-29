import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import "./Login.css";
import PropTypes from "prop-types";
import { loginUser } from "../actions/authActions";
import classnames from "classnames";

function Login(props) {
  const [email, setEmail] = useState("luke@admin.cz");
  const [password, setPassword] = useState("123123");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (props.auth.isAuthenticated) {
      props.history.push("/app");
    }
  });

  useEffect(() => {
    if (props.errors) {
      setErrors(props.errors);
    }
  }, [props]);

  function onSubmit(e) {
    e.preventDefault();

    const userData = {
      email: email,
      password: password,
    };

    props.loginUser(userData);
  }

  return (
    <div className="loginWrapper">
      <form noValidate onSubmit={onSubmit}>
        <div>
          <div className="inputTitle">Email</div>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            error={errors.email}
            className={classnames("styled", { invalid: errors.email })}
            id="email"
            type="email"
          />
          <div className="errorWrapper">
            <span>{errors.email}</span>
          </div>
        </div>
        <div>
          <div className="inputTitle">Password</div>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            error={errors.password}
            className={classnames("styled", { invalid: errors.password || errors.passwordincorrect})}
            id="password"
            type="password"
          />
          <div className="errorWrapper">
            <span>{errors.password}{errors.passwordincorrect}</span>
          </div>
        </div>
        <div className="buttonLast">
          <button type="submit" className="styled" id="signIn">
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { loginUser })(withRouter(Login));
