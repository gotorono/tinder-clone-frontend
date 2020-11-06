import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://tinder-clone-goter.herokuapp.com/'
});

export default instance;