<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" v-if="logged" app>
      <template>
        <v-list dense>
          <template>
            <v-list-item :to="{ name: 'Home' }">
              <v-list-item-action>
                <v-icon>mdi-home</v-icon>
              </v-list-item-action>
              <v-list-item-title>Inicio</v-list-item-title>
            </v-list-item>
            <v-list-item :to="{ name: 'Configuration' }">
              <v-list-item-action>
                <v-icon>settings</v-icon>
              </v-list-item-action>
              <v-list-item-title>Configuración</v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <!-- <v-toolbar-title>Envío de Mensajes por WhatsApp</v-toolbar-title> -->
      <v-spacer></v-spacer>
      <v-btn color="red" class="ma-2 white--text" @click="logout" v-if="logged">
        LogOut
        <v-icon right dark>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
          <router-view />
        </v-slide-y-transition>
      </v-container>
    </v-main>
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
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import router from "./router/index";

export default {
  data: () => ({ drawer: null }),
  computed: {
    logged() {
      if (this.$store.state.userProfile == null) this.logout();
      return this.$store.state.userProfile;
    },
  },
  methods: {
     async logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$store.state.userProfile = null;
          router.push("/login");
        })
        .catch((error) => {
          router.push("/login");
        });
    },
  },
};
</script>