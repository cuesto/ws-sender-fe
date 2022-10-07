import firebase from 'firebase/compat/app';
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBvbXAUEKOrYswwj4dQIt1HjL49ESU4h-k",
  authDomain: "ims-spa.firebaseapp.com",
  databaseURL: "https://ims-spa.firebaseio.com",
  projectId: "ims-spa",
  storageBucket: "ims-spa.appspot.com",
  messagingSenderId: "253986606960",
  appId: "1:253986606960:web:d25b722a76cf8c4d8f09b5",
  measurementId: "G-WLQK3ZZF5P"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebaseApp.auth();

const db = getFirestore(firebaseApp);
enableIndexedDbPersistence(db);

export {
  auth,
  firebaseApp
}