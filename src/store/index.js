import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import { firebaseApp } from '../firebase';
import { getFirestore,doc, getDoc } from "firebase/firestore";

import router from '../router/index'

const db = getFirestore(firebaseApp);

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userProfile: null
  },
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val
    }
  },
  actions: {
    async login({ dispatch }, form) {
      // sign user in
      const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)
      // fetch user profile and set in state
      dispatch('fetchUserProfile', user)
    },

    async signup({ dispatch }, form) {
      // sign user up
      const { user } = await fb.auth.createUserWithEmailAndPassword(form.email, form.password)
    
      // create user profile object in userCollections
      await fb.usersCollection.doc(user.uid).set({
        name: form.name,
        server: form.server
      })
    
      // fetch user profile and set in state
      dispatch('fetchUserProfile', user)
    },

    async fetchUserProfile({ commit }, user) {
      // fetch user profile
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      // set user profile in state
      commit('setUserProfile', docSnap.data())
      // change route to dashboard
      router.push('/')
    },

   async logout() {
       await  fb
        .auth()
        .signOut()
        .then(() => {
          alert('Successfully logged out');
          router.push('/');
        })
        .catch(error => {
          alert(error.message);
          router.push('/');
        });
    },
  },
  modules: {
  }
})
