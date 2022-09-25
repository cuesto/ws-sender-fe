import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';



// firebase init
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
//const db = firebaseApp.firestore;
const auth = firebaseApp.auth();

export {
  //db,
  auth,
  firebaseApp
}