import React, { useState, useEffect } from 'react'
import TinderCard from 'react-tinder-card';
import './TinderCards.css'
import { updateUser } from './actions/authActions';
import axios from './axios';

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

function TinderCards(props) {
    const [people, setPeople] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get('/tinder/cards', 
            {
                params: {
                    user: props.auth.user,
                }
            });
            setPeople(request.data);
        }

        fetchData();
    }, [])

    const updateSwiped = () => {
        const userData = {
            id: props.auth.user.id
        }
        async function update() {
            await props.updateUser(userData);
        }
        update();
    }

    const swiped = (direction, user) => {
        let error = false;
        axios.post('/tinder/cards', {userId: props.auth.user.id, swipedId: user._id})
        .catch(error => {
            error = true;
        })

        if(!error) {
            updateSwiped();
        }
    };

    const outOfFrame = (name) => {
        console.log(name + " has left the screen");
    }

    console.log(people)
    console.log(props.auth.user);

    return (
        <div className="tinderCards">
            <div className="tinderCards__cardContainer">
            {people.map((person) => (
                <TinderCard
                className="swipe"
                key={person._id}
                preventSwipe={['up', 'down']}
                onSwipe={(dir) => swiped(dir, person)}
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

const mapStateToProps = (state) => ({
    auth: state.auth
  });

export default connect(mapStateToProps, { updateUser })(withRouter(TinderCards));
