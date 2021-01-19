import io from 'socket.io-client';

export const socket = // io("https://tinder-clone-goter.herokuapp.com/"); 
io("http://localhost:8001");
