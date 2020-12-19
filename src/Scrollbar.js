import React, { useState } from 'react';

import { Scrollbars } from 'react-custom-scrollbars';

function Scrollbar(props) {

    const [top, setTop] = useState({top: 0});

    function handleScrollFrame(values) {
        const { top } = values;
        setTop({top})
    }

    function renderView({ style, ...props }) {
        const color = top * 255;
        const customStyle = {
            backgroundColor: `rgb(${color}, ${color}, ${color})`,
            overflowX: "hidden",
            marginBottom: 0,
            padding: ".5em 20px"
        };
        return (
            <div id="chatMessagesWrapper" {...props} style={{ ...style, ...customStyle }}/>
        );
    }

    return(
            <Scrollbars
                renderView={renderView}
                onScrollFrame={handleScrollFrame}
                {...props}/>
    )
}

export default Scrollbar;