import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import Clients from '../views/Clients.vue'
import Campaigns from '../views/ContactCenter/Campaigns.vue'
import WSServer from '../views/WSServer.vue'
import About from '../views/About.vue'
import Dashboard from '../views/Dashboard.vue'
import {
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
    meta: {
      requiresGuest: true
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
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
    path: '/campaigns',
    name: 'campaigns',
    component: Campaigns,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/wsserver',
    name: 'wsserver',
    component: WSServer,
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
          path: '/',
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
          path: '/dashboard',
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
