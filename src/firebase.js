import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

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
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()

// collection references
const usersCollection = db.collection('users')
const requestCollection = db.collection('request')
const logsCollection = db.collection('logs')

// export utils/refs
export {
  db,
  auth,
  usersCollection,
  requestCollection,
  logsCollection
}