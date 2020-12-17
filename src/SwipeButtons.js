import React, { useState } from "react";
import "./SwipeButtons.css";

import ReplayIcon from "@material-ui/icons/Replay";
import CloseIcon from "@material-ui/icons/Close";
import StarRateIcon from "@material-ui/icons/StarRate";
import FavoriteIcon from "@material-ui/icons/Favorite";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import IconButton from "@material-ui/core/IconButton";

function SwipeButtons(props) {
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  function handleClick(value) {
    if (!buttonsDisabled) {
      setButtonsDisabled(true);
      setTimeout(() => setButtonsDisabled(false), 500);
      if (props.swipe) {
        props.swipe(value);
      }
    }
  }

  return (
    <div className="swipeButtons">
      <IconButton
        onMouseUp={() => handleClick("replay")}
        className="swipeButtons__ replay"
      >
        <ReplayIcon className="swipeButton" />
      </IconButton>
      <IconButton
        onMouseUp={() => handleClick("left")}
        className="swipeButtons__ left"
      >
        <CloseIcon className="swipeButton" />
      </IconButton>
      <IconButton
        onMouseUp={() => handleClick("star")}
        className="swipeButtons__ star"
      >
        <StarRateIcon className="swipeButton" />
      </IconButton>
      <IconButton
        onMouseUp={() => handleClick("right")}
        className="swipeButtons__ right"
      >
        <FavoriteIcon className="swipeButton" />
      </IconButton>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(withRouter(SwipeButtons));
