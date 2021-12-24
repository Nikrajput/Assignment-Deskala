import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app";
import {
  getAuth
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB7CgzkHmXyyXXbcRZL0T7I5GNgIaW6fTM",
  authDomain: "assignment-deskala.firebaseapp.com",
  databaseURL: "https://assignment-deskala-default-rtdb.firebaseio.com",
  projectId: "assignment-deskala",
  storageBucket: "assignment-deskala.appspot.com",
  messagingSenderId: "53915591138",
  appId: "1:53915591138:web:d66385bd485185fcb0d9bb"
};
if (!firebase.apps.length) {
  //initializing with the config object
  firebase.initializeApp(firebaseConfig);
}

const firebaseApp = initializeApp(firebaseConfig);

// ** Modulerized Firebase ** //
const auth = getAuth(firebaseApp);
const db = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);

let user = auth.currentUser;


export {
  user,
  db,
  auth,
  firebaseApp as firebase,
  storage,
};
