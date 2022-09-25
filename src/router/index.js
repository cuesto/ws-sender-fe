import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Configuration from '../views/Configuration.vue'
import Login from '../views/Login.vue'
import {
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requiresGuest: true
    }
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    //component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/Configuration',
    name: 'configuration',
    component: Configuration,
    meta: {
      requiresAuth: true
    }
  }
]

const router = new Router({
  mode: 'history',
  //base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const auth = getAuth();

  // checks for requiredAuth
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // check if not logged in
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        // go to login page
        next({
          path: '/login',
          query: {
            redirect: to.fullPath
          }
        });
      } else {
        next();
      }
    });
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // go to home page
        next({
          path: '/',
          query: {
            redirect: to.fullPath
          }
        });
      } else {
        next();
      }
    });
  }
  else {
    next();
  }


});

export default router;
