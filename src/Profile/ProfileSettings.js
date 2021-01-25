import React, { useEffect, useState } from "react";
import "./ProfileSettings.css";

import axios from "../axios";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";

import Select from "react-select";
import { customStyles } from "../customStyles/select";

import Slider from '../Slider/Slider';

import classnames from "classnames";

import { showOptions } from "../variables";

function ProfileSettings(props) {
  const [show, setShow] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (props.errors) setErrors(props.errors);
  }, [props.errors]);

  useEffect(() => {
    axios.get("/tinder/users/profile/get", {params: {
      _id: props.auth.user.id
    }})
    .then((user) => {
      if(user.data.lookingFor)
        setShow(user.data.lookingFor);
      else 
        setShow("everyone")
    })
  }, [props.auth.user.id])

  function onLogoutClick(e) {
    e.preventDefault();
    props.logoutUser();
  }

  function deleteAll(e) {
    e.preventDefault();
    axios.post("tinder/cards/delete/all").then(() => {
      console.log("Deleted");
    });
  }

  const changeLookingFor = (e) => {
    axios
      .post("/tinder/users/lookingFor", {
        id: props.auth.user.id,
        lookingFor: e.value,
      })
      .then(() => {
        setShow(e.value);
        props.forceUpdate();
      });
  };

  function deleteSwiped(e) {
    e.preventDefault();
    axios
      .post("tinder/cards/delete/swiped", { id: props.auth.user.id })
      .then(() => {
        console.log("Deleted");
      });
  }

  return (
    <div className="profileSettings">
      <div className="profileSettingsItemsWrapper">
        
        <div className="ageRangeTitle">Age range</div>
        <div className="profileSettingsItem sliderItem">
          <Slider min={18} max={60} forceUpdate={() => props.forceUpdate()} />
        </div>

        <div className="lookingForWrapper">
          <div className="inputTitle">I'm looking for</div>
          <Select
            className={classnames("profileSettingsSelect", {
              invalid: errors.show,
            })}
            onChange={changeLookingFor}
            options={showOptions}
            isSearchable={false}
            value={showOptions.filter((option) => option.value === show)}
            styles={customStyles}
            placeholder="Show"
          />

          <div className="errorWrapper">
            <span>{errors.show}</span>
          </div>
        </div>

        <div className="borderSpacer"></div>

        <div className="profileSettingsItem" onClick={(e) => deleteSwiped(e)}>
          <span>WIP: Delete swiped</span>
        </div>
        {/* <div className="profileSettingsItem" onClick={(e) => deleteAll(e)}>
          <span>WIP: Delete all</span>
        </div> */}

        <div className="profileSettingsItem" onClick={(e) => onLogoutClick(e)}>
          <span>Logout</span>
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

export default connect(mapStateToProps, {
  logoutUser,
})(ProfileSettings);
