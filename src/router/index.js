import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Clients from '../views/Clients.vue'
import Configuration from '../views/Configuration.vue'
import About from '../views/About.vue'
import {
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";

Vue.use(Router)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requiresGuest: true
    }
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/clients',
    name: 'clients',
    component: Clients,
    meta: {
      requiresAuth: true
    }
  },
  {
    //TODO: change name to wsserver
    path: '/Configuration',
    name: 'configuration',
    component: Configuration,
    meta: {
      requiresAuth: true
    },

  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      requiresAuth: true
    }
  },
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
          path: '/home',
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
