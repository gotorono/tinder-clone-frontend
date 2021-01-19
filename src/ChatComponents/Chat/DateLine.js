import React from 'react'

import './DateLine.css';

import { dateDiffInDays } from '../../variables';

function DateLine(props) {

    const formatDate = (date) => {
        const moreThanDay = (date) => {
            return date.getDate() + ". " + (date.getMonth() + 1) + ". " + date.getHours() + ":" + date.getMinutes();
        }
        const lessThanDay = (date) => {
            return date.getHours() + ":" + date.getMinutes();
        }

        let newDate = new Date(date);
        const formattedDate = dateDiffInDays(newDate, new Date(Date.now())) > 1 ? moreThanDay(newDate) : lessThanDay(newDate)
        return formattedDate;
    }

    return (
        <div className="dateLine">
            {formatDate(props.date)}
        </div>
    )
}

export default DateLine
