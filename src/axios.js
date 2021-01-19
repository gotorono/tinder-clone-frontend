import axios from 'axios';

const instance = axios.create({
    baseURL: //'https://tinder-clone-goter.herokuapp.com/'
    'http://localhost:8001'
});

export default instance;