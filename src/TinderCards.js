import React, { useState, useEffect } from 'react'
import TinderCard from 'react-tinder-card';
import './TinderCards.css'
import axios from './axios';

function TinderCards() {
    const [people, setPeople] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get('/tinder/cards');
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
    console.log(people);


    return (
        <div className="tinderCards">
            <div className="tinderCards__cardContainer">
            {people.map((person) => (
                <TinderCard
                className="swipe"
                key={person._id}
                preventSwipe={['up', 'down']}
                onSwipe={(dir) => swiped(dir, person.name)}
                onCardLeftScreen={() => outOfFrame(person.name)}
                >
                    <div style={ {backgroundImage: `url(${person.profileImg})`} }
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
