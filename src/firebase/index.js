import firebase from "firebase/app";
import "firebase/storage";
import {FIREBASE_API_KEY} from '../config';

const config = {
 apiKey: FIREBASE_API_KEY,
 authDomain: "slickproject-fbaad.firebaseapp.com",
 databaseURL: "https://slickproject-fbaad.firebaseio.com",
 projectId: "slickproject-fbaad",
 storageBucket: "slickproject-fbaad.appspot.com",
 messagingSenderId: "375260658649",
 appId: "1:375260658649:web:50d2dbee6d88dabf"
};

firebase.initializeApp(config);

const storage = firebase.storage();

export { storage, firebase as default };