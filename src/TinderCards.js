import React, { useState, useEffect } from 'react'
import TinderCard from 'react-tinder-card';
import './TinderCards.css'
import axios from './axios';

function TinderCards() {
    const [people, setPeople] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get('/tinder/cards');
            console.log(request.data);
            setPeople(request.data);
        }

        fetchData();
    }, [])

    const swiped = (direction, nameToDelete) => {
        console.log("removing " + nameToDelete);
        console.log(direction);
        //setLastDirection(direction);
    };

    const outOfFrame = (name) => {
        console.log(name + " has left the screen");
    }


    return (
        <div className="tinderCards">
            <div className="tinderCards__cardContainer">
            {people.map((person) => (
                <TinderCard
                className="swipe"
                key={person.name}
                preventSwipe={['up', 'down']}
                onSwipe={(dir) => swiped(dir, person.name)}
                onCardLeftScreen={() => outOfFrame(person.name)}
                >
                    <div style={ {backgroundImage: `url(${person.imgUrl})`} }
                    className="card">
                        <div className="desc-container">
            <h3>{person.name}<span className="age"> &nbsp;{person.age}</span></h3>
                        <div className="desc">{person.desc}</div>
                        </div>
                    </div>
                </TinderCard>
            ))}
            </div>
        </div>
    )
}

export default TinderCards
