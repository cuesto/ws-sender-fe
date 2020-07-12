import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// firebase init - add your own config here
const firebaseConfig = {
    apiKey: "AIzaSyBvbXAUEKOrYswwj4dQIt1HjL49ESU4h-k",
    authDomain: "ims-spa.firebaseapp.com",
    databaseURL: "https://ims-spa.firebaseio.com",
    projectId: "ims-spa",
    storageBucket: "ims-spa.appspot.com",
    messagingSenderId: "253986606960",
    appId: "1:253986606960:web:d25b722a76cf8c4d8f09b5",
    measurementId: "G-WLQK3ZZF5P"
  }
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()

// collection references
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')

// export utils/refs
export {
  db,
  auth,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection
}