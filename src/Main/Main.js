import React, { useState } from 'react';

import "./Main.css";

import Header from '../Header';
import Messages from '../Messages/Messages';
import Matches from '../Matches/Matches';
import Profile from '../Profile/Profile';
import TinderCards from '../TinderCards';
import SwipeButtons from '../SwipeButtons';

function Main() {

    const [refresh, setRefresh] = useState({swipe: 0});

    const [render, setRender] = useState('matches');

    function fnc(value) {
           setRefresh({swipe: value});
    }

    function route(value) {
        setRender(value);
    }

    function _renderSubComp() {
        switch(render) {
            case 'matches' : return <Matches />
            case 'profile' : return <Profile />
            case 'messages' : return <Messages />
        }
    }

    return(
        <div className="main">
            <div className="sidebar">
                <Header route={route}/>
                {_renderSubComp()}
            </div>
            <div className="app">
                <TinderCards refresh={refresh} />
                <SwipeButtons swipe={fnc} />
            </div>
          </div>
    ) 
}

export default Main;