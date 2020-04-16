import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD4N35_56fUS-gcR03pbE08EwRK8q9el7k",
    authDomain: "slack-app-63696.firebaseapp.com",
    databaseURL: "https://slack-app-63696.firebaseio.com",
    projectId: "slack-app-63696",
    storageBucket: "slack-app-63696.appspot.com",
    messagingSenderId: "454448373617",
    appId: "1:454448373617:web:596d528948858b7652a0d0",
    measurementId: "G-81GKKNZHGX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export default firebase;
