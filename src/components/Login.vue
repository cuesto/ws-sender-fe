<template>
<v-main>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-12">
                    <v-toolbar color="primary" dark flat>
                        <v-toolbar-title>WhatsApp Send Msg</v-toolbar-title>
                        <div class="flex-grow-1"></div>
                    </v-toolbar>
                    <v-card-text>
                        <div :class="{ 'signup-form': !showLoginForm }" class="col2">
                            <form v-if="showLoginForm" @submit.prevent>
                                <h1>Bienvenido</h1>
                                <v-text-field v-model.trim="loginForm.email" label="Email" name="login" prepend-icon="mail" type="text" :rules="[rules.required, rules.email]"></v-text-field>
                                <v-text-field v-on:keyup.enter="login" v-model.trim="loginForm.password" id="password" label="Contraseña" name="password" prepend-icon="lock" type="password" :rules="[rules.required]"></v-text-field>
                                <v-flex class="red--text" v-if="error">{{ error }}</v-flex>
                                <v-btn color="primary" @click="login">Ingresar</v-btn>
                                <div class="extras">
                                    <v-spacer></v-spacer>
                                    <!-- Activate if need to create new account -->
                                    <a @click="toggleForm()">Crear una cuenta</a>
                                </div>
                            </form>
                            <form v-else @submit.prevent>
                                <h1>Get Started</h1>
                                <v-text-field v-model.trim="signupForm.name" label="Nombre" name="name" prepend-icon="person" type="text" :rules="[rules.required]"></v-text-field>
                                <v-text-field v-model.trim="signupForm.username" label="Usuario" name="username" prepend-icon="person" type="text" :rules="[rules.required]"></v-text-field>
                                <v-text-field v-model.trim="signupForm.email" label="Email" name="email2" prepend-icon="mail" type="text" :rules="[rules.required, rules.email]"></v-text-field>
                                <v-text-field v-model.trim="signupForm.password" id="password" label="Contraseña" name="password2" prepend-icon="lock" type="password" :rules="[rules.required]"></v-text-field>
                                <v-text-field v-model.trim="signupForm.server" label="Servidor" name="server" prepend-icon="storage" type="text" :rules="[rules.required]"></v-text-field>
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
import {
    getAuth,
    updateProfile,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import {
    firebaseApp
} from "../firebase";
import {
    getFirestore,
    doc,
    getDocs,
    setDoc,
    collection,
} from "firebase/firestore";
const auth = getAuth();
const db = getFirestore(firebaseApp);

export default {
    data: () => ({
        loginForm: {
            email: "jcuesto@domex.com.do",
            password: "123456",
        },
        signupForm: {
            name: "", //"jhon",
            username: "", //"jhcuesto",
            email: "", //"jc@mail.com",
            password: "", //"123456",
            server: "", //"www.server.com",
        },
        showLoginForm: true,
        rules: {
            required: (value) => !!value || "Requerido.",
            email: (value) => {
                const pattern =
                    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return pattern.test(value) || "Correo Inválido.";
            },
        },
        error: null,
        clients: [],
    }),

    created() {},

    methods: {
        toggleForm() {
            this.showLoginForm = !this.showLoginForm;
        },

        async login() {
            const auth = getAuth();
            signInWithEmailAndPassword(
                    auth,
                    this.loginForm.email,
                    this.loginForm.password
                )
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    console.log("Logueado:");
                    console.log(user);
                    this.getClients();
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode + " - " + errorMessage);
                    this.error = errorMessage;
                });
        },

        async signup() {
            const auth = getAuth();
            const profilesRef = collection(db, "profiles");
            createUserWithEmailAndPassword(
                    auth,
                    this.signupForm.email,
                    this.signupForm.password
                )
                .then((userCredential) => {
                    // Signed in
                    let registeredUser = userCredential.user;
                    console.log("registrado:");
                    console.log(registeredUser);
                    //Registra o perfil
                    setDoc(doc(profilesRef, registeredUser.uid), {
                            name: this.signupForm.name,
                            email: this.signupForm.email,
                            username: this.signupForm.username,
                            server: this.signupForm.server,
                        })
                        .then(() => {
                            console.log("se creo el profile");
                            updateProfile(auth.currentUser, {
                                    displayName: this.signupForm.username,
                                })
                                .then(() => {
                                    this.$router.go({
                                        path: this.$router.path
                                    });
                                    console.log("se actualizó:");
                                    console.log(registeredUser);
                                })
                                .catch(() => console.log);
                        })
                        .catch(() => console.log);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode + " - " + errorMessage);
                    this.error = errorMessage;
                });
        },

        async getClients() {
            this.clients = [];
            const querySnapshot = await getDocs(
                collection(db, "profiles/" + auth.currentUser.uid + "/clients")
            );
            querySnapshot.forEach((doc) => {
                this.clients.push({
                    id: doc.data().id,
                    name: doc.data().name,
                    phone: doc.data().phone,
                });
            });
        },
    },
};
</script>
