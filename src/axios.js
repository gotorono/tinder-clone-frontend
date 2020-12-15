import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8001'//'https://tinder-clone-goter.herokuapp.com/'
});

export default instance;