<template>
  <v-app id="inspire">
    <v-card class="overflow-hidden" height="100%">
      <v-navigation-drawer v-model="drawer" v-if="isLoggedIn" app>
        <v-list dense nav>
          <v-list-item-group
            v-model="group"
            active-class="deep-purple--text text--accent-4"
          >
            <v-list-item :to="{ name: 'home' }" link>
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Inicio</v-list-item-title>
            </v-list-item>
            <v-list-item :to="{ name: 'configuration' }">
              <v-list-item-icon>
                <v-icon>settings</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Configuración</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar app>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>WS Sender</v-toolbar-title>
      </v-app-bar>
      <v-main>
        <v-container fluid fill-height>
          <v-slide-y-transition mode="out-in">
            <router-view />
          </v-slide-y-transition>
        </v-container>
      </v-main>
    </v-card>
    <v-footer blue height="auto">
      <v-layout justify-center>
        <v-flex text-md-right>
          <v-card flat tile color="primary" class="white--text">
            <v-card-text class="white--text pt-0"
              >InfoSocial &copy;2022</v-card-text
            >
          </v-card>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import router from "./router/index";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const auth = getAuth();

export default {
  data: () => ({
    drawer: true,
    isLoggedIn: false,
    group: null,
  }),
  created() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
  },
  methods: {
    async logout() {
      signOut(auth)
        .then(() => {
          console.log("se deslogueo");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>