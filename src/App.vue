<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp"  app>
      <template>
        <v-list dense>
          <template >
            <v-list-item :to="{name:'Home'}">
              <v-list-item-action>
                <v-icon>mdi-home</v-icon>
              </v-list-item-action>
              <v-list-item-title>Inicio</v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <span class="hidden-sm-and-down">Inventory Management</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn @click="logout" v-if="logged" text>
        <v-icon>logout</v-icon>Salir
      </v-btn>
      <v-btn :to="{name: 'login'}" v-else text>
        <v-icon>apps</v-icon>Login
      </v-btn> -->
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
            <v-card-text class="white--text pt-0">InfoSocial &copy;2020</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<style>
body {
  font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial,
    sans-serif;
}
</style>


<script>
export default {
  name: "App",
  data: () => ({
    //
    drawer: null
  }),
  computed: {
    
  },
  created() {
    
  },
  methods: {
    
  }
};
</script>
