import axios from 'axios';

const instance = axios.create({
    baseURL: //'https://tinder-clone-goter.herokuapp.com/'
     'http://10.0.0.1:8001'
});

export default instance;