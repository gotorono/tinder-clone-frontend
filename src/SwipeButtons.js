import React from 'react'
import './SwipeButtons.css';

import ReplayIcon from "@material-ui/icons/Replay"
import CloseIcon from "@material-ui/icons/Close"
import StarRateIcon from "@material-ui/icons/StarRate"
import FavoriteIcon from "@material-ui/icons/Favorite"
import FlashOnIcon from "@material-ui/icons/FlashOn"

import IconButton from "@material-ui/core/IconButton"


const handleClick = value => {
    console.log(value);
}

function SwipeButtons() {
    return (
        <div className="swipeButtons">
            <IconButton onMouseUp={handleClick('replay')} className="swipeButtons__ replay">
                <ReplayIcon className="swipeButton" />
            </IconButton>
            <IconButton onMouseUp={handleClick('left')} className="swipeButtons__ left">
                <CloseIcon className="swipeButton" />
            </IconButton>
            <IconButton onMouseUp={handleClick('star')} className="swipeButtons__ star">
                <StarRateIcon className="swipeButton" />
            </IconButton>
            <IconButton onMouseUp={handleClick('right')} className="swipeButtons__ right">
                <FavoriteIcon className="swipeButton" />
            </IconButton>
            <IconButton onMouseUp={handleClick('lightning')} className="swipeButtons__ lightning">
                <FlashOnIcon className="swipeButton" />
            </IconButton>
        </div>
    )
}

export default SwipeButtons
