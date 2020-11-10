import React from 'react';

import Header from '../Header';
import TinderCards from '../TinderCards';
import SwipeButtons from '../SwipeButtons';

function Main() {
    return(
        <div className="main">
            <Header />
            <TinderCards />
            <SwipeButtons />
          </div>
    ) 
}

export default Main;