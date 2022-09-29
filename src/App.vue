<template>
  <v-app id="inspire">
    <v-card class="overflow-hidden" height="100%">
      <v-navigation-drawer v-model="drawer" v-if="isLoggedIn" app>
        <v-list dense nav>
          <v-list-item-group active-class="blue--text text--accent-3">
            <v-list-item :to="{ name: 'home' }">
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Inicio</v-list-item-title>
            </v-list-item>
            <v-list-item :to="{ name: 'about' }">
              <v-list-item-icon>
                <v-icon>mdi-view-dashboard</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item>
            <v-list-group :value="false" prepend-icon="mdi-contacts" no-action>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>Contact Center</v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item :to="{ name: 'clients' }">
                <v-list-item-icon>
                  <v-icon>mdi-account-multiple</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Clientes</v-list-item-title>
              </v-list-item>
              <v-list-item :to="{ name: 'about' }">
                <v-list-item-icon>
                  <v-icon>mdi-account-group</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Grupos</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-send</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Campañas</v-list-item-title>
              </v-list-item>
            </v-list-group>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-image-multiple</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Galería</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-chart-bar</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Reportes</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-history</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Historial</v-list-item-title>
            </v-list-item>
            <v-list-group :value="false" prepend-icon="settings" no-action>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>Configuración</v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item :to="{ name: 'wsserver' }">
                <v-list-item-icon>
                  <v-icon>mdi-server</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Servidor WhatsApp</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-account-multiple</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Usuarios</v-list-item-title>
              </v-list-item>
            </v-list-group>
          </v-list-item-group>
        </v-list>
        <template v-slot:append>
          <div class="pa-2">
            <v-btn color="secondary" @click="logout" block> Logout </v-btn>
          </div>
        </template>
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