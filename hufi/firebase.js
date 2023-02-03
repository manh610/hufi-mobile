import * as firebase  from 'firebase';
// Optionally import the services that you want to use
//import {...} from "firebase/auth";
//import {...} from "firebase/database";
//import {...} from "firebase/firestore";
//import {...} from "firebase/functions";
//import {...} from "firebase/storage";


//CLI
/*import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import {firebase} from '@react-native-firebase/firestore';*/

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzj7FLJCzaeuukm-B7KMOOFpC5_krB4NU",
  authDomain: "signal-clone-rnative.firebaseapp.com",
  projectId: "signal-clone-rnative",
  storageBucket: "signal-clone-rnative.appspot.com",
  messagingSenderId: "643458930021",
  appId: "1:643458930021:web:9b3b0eaef97ee7ecb27d8c",
  measurementId: "G-VSKD0PNTQ8",
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app;
}

const db = firebase.firestore;
const auth = firebase.auth;
const messaging = firebase.messaging;
export { db, auth,messaging };