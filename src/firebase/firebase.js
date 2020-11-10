import firebase from 'firebase/app'
import 'firebase/storage'

var firebaseConfig = {
    apiKey: "AIzaSyBgQhH7ifnBVsv9SgRBI58FOmyocgjFXI8",
    authDomain: "tinder-clone-8d2de.firebaseapp.com",
    databaseURL: "https://tinder-clone-8d2de.firebaseio.com",
    projectId: "tinder-clone-8d2de",
    storageBucket: "tinder-clone-8d2de.appspot.com",
    messagingSenderId: "600451335321",
    appId: "1:600451335321:web:df88d49a58faef90766408",
    measurementId: "G-P2K4H8R3SQ"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const storage = firebase.storage();

  export {
      storage, firebase as default
  }