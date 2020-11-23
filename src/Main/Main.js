import React, { useState } from 'react';

import Header from '../Header';
import TinderCards from '../TinderCards';
import SwipeButtons from '../SwipeButtons';

function Main() {

    function fnc(value) {
           setRefresh({swipe: value});
    }

    const [refresh, setRefresh] = useState({swipe: 0});

    return(
        <div className="main">
            <Header />
            <TinderCards refresh={refresh} />
            <SwipeButtons swipe={fnc} />
          </div>
    ) 
}

export default Main;