import React from 'react'
import './SwipeButtons.css';

import ReplayIcon from "@material-ui/icons/Replay"
import CloseIcon from "@material-ui/icons/Close"
import StarRateIcon from "@material-ui/icons/StarRate"
import FavoriteIcon from "@material-ui/icons/Favorite"
import FlashOnIcon from "@material-ui/icons/FlashOn"

import IconButton from "@material-ui/core/IconButton"

function SwipeButtons() {
    return (
        <div className="swipeButtons">
            <IconButton className="swipeButtons__ replay">
                <ReplayIcon className="swipeButton" />
            </IconButton>
            <IconButton className="swipeButtons__ left">
                <CloseIcon className="swipeButton" />
            </IconButton>
            <IconButton className="swipeButtons__ star">
                <StarRateIcon className="swipeButton" />
            </IconButton>
            <IconButton className="swipeButtons__ right">
                <FavoriteIcon className="swipeButton" />
            </IconButton>
            <IconButton className="swipeButtons__ lightning">
                <FlashOnIcon className="swipeButton" />
            </IconButton>
        </div>
    )
}

export default SwipeButtons
