import React from 'react'

import { dateDiffInDays } from '../../variables';

function NoMessages(props) {
    return (
        <div>
            <div>
              You are connected with <b>{props.chatUser.name}</b>{" "}
            </div>
            <div>
              for{" "}
              <b>
                {dateDiffInDays(new Date(props.matchDate), new Date(Date.now())) === 0
                  ? 1
                  : dateDiffInDays(
                      new Date(props.matchDate),
                      new Date(Date.now())
                    )}{" "}
                {dateDiffInDays(new Date(props.matchDate), new Date(Date.now())) >
                  1 ||
                dateDiffInDays(new Date(props.matchDate), new Date(Date.now())) === 0
                  ? "days"
                  : "day"}
              </b>
            </div>
            <div
              className="waitingForMessagePic"
              style={{ backgroundImage: `url(${props.chatUser.profileImg})` }}
            ></div>
          </div>
    )
}

export default NoMessages
