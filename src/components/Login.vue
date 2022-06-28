<template>
  <v-main>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Inventory Management Tool</v-toolbar-title>
              <div class="flex-grow-1"></div>
            </v-toolbar>
            <v-card-text>
              <div :class="{ 'signup-form': !showLoginForm }" class="col2">
                <form v-if="showLoginForm" @submit.prevent>
                  <h1>Bienvenido</h1>
                  <v-text-field
                    v-model.trim="loginForm.email"
                    label="Email"
                    name="login"
                    prepend-icon="mail"
                    type="text"
                    :rules="[rules.required, rules.email]"
                  ></v-text-field>
                  <v-text-field
                    v-on:keyup.enter="login"
                    v-model.trim="loginForm.password"
                    id="password"
                    label="Contraseña"
                    name="password"
                    prepend-icon="lock"
                    type="password"
                    :rules="[rules.required]"
                  ></v-text-field>
                  <v-flex class="red--text" v-if="error">{{ error }}</v-flex>
                  <v-btn color="primary" @click="login">Ingresar</v-btn>
                  <div class="extras">
                    <!-- <a @click="togglePasswordReset()">Olvidar Contraseña</a> -->
                    <v-spacer></v-spacer>
                    <a @click="toggleForm()">Crear una cuenta</a>
                  </div>
                </form>
                <form v-else @submit.prevent>
                  <h1>Get Started</h1>
                  <v-text-field
                    v-model.trim="signupForm.name"
                    label="Nombre"
                    name="name"
                    prepend-icon="person"
                    type="text"
                    :rules="[rules.required]"
                  ></v-text-field>
                  <v-text-field
                    v-model.trim="signupForm.email"
                    label="Email"
                    name="email2"
                    prepend-icon="mail"
                    type="text"
                    :rules="[rules.required, rules.email]"
                  ></v-text-field>
                  <v-text-field
                    v-model.trim="signupForm.password"
                    id="password"
                    label="Contraseña"
                    name="password2"
                    prepend-icon="lock"
                    type="password"
                    :rules="[rules.required]"
                  ></v-text-field>
                  <v-text-field
                    v-model.trim="signupForm.server"
                    label="Servidor"
                    name="server"
                    prepend-icon="Storage"
                    type="text"
                    :rules="[rules.required]"
                  ></v-text-field>
                  <v-flex class="red--text" v-if="error">{{ error }}</v-flex>
                  <v-btn color="primary" @click="signup">Registrar</v-btn>

                  <div class="extras">
                    <a @click="toggleForm()">Volver al LogIn</a>
                  </div>
                </form>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    loginForm: {
      email: "",
      password: "",
    },
    signupForm: {
      name: "",
      email: "",
      password: "",
      server: ""
    },
    showLoginForm: true,
    rules: {
      required: (value) => !!value || "Requerido.",
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Correo Inválido.";
      },
    },
    error: null,
  }),
  created() {},
  methods: {
  toggleForm() {
      this.showLoginForm = !this.showLoginForm
    },
    async login() {
      this.$store.dispatch("login", {
        email: this.loginForm.email,
        password: this.loginForm.password,
      });
      this.$router.push({ name: "home" });
    },
    signup() {
      this.$store.dispatch("signup", {
        email: this.signupForm.email,
        password: this.signupForm.password,
        name: this.signupForm.name,
        server: this.signupForm.server
      });
      this.$router.push({ name: "login" });
    },
  },
};
</script>