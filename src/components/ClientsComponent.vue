<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :search="search"
        :items="clients"
        sort-by="name"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Clientes</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
              class="text-xs-center"
              v-model="search"
              append-icon="search"
              label="Búsqueda"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" persistent max-width="600px">
              <template v-slot:activator="{ on }">
                <v-btn color="green" dark v-on="on">
                  <v-icon left dark>person_add</v-icon>Nuevo Cliente
                </v-btn>
              </template>
              <v-form ref="form">
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            label="Código*"
                            :rules="[rules.required]"
                            v-model="clientModel.id"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            label="Nombre*"
                            :rules="[rules.required]"
                            v-model="clientModel.name"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            label="Celular*"
                            :rules="[rules.required]"
                            v-mask="mask"
                            v-model="clientModel.phone"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                    <small>*Campo requerido.</small>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog = false"
                      >Cerrar</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="save">
                      <v-icon left>save</v-icon>Guardar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>
          </v-toolbar>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-icon
            size="sm"
            variant="outline-info"
            color="blue"
            class="mr-1"
            @click="editItem(item)"
            >edit</v-icon
          >
          <v-icon size="sm" color="red" class="mr-1" @click="deleteItem(item)"
            >delete</v-icon
          >
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="getClients">
            <v-icon left dark>autorenew</v-icon>Refrescar
          </v-btn>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>
<script>
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../firebase";
import {
  getFirestore,
  doc,
  getDocs,
  setDoc,
  collection,
} from "firebase/firestore";
import ClientModel from "../models/ClientModel";
import { mask } from "vue-the-mask";
const { phoneNumberFormatter } = require("../helpers/formatter");

const auth = getAuth();
const db = getFirestore(firebaseApp);

export default {
  directives: {
    mask,
  },
  data: () => ({
    clients: [],
    mask: "##########",
    dialog: false,
    headers: [
      { text: "Id", sortable: true, value: "id" },
      { text: "Nombre", sortable: true, value: "name" },
      { text: "Celular", sortable: false, value: "phone" },
      { text: "Opciones", value: "actions", sortable: false },
    ],
    rules: {
      required: (value) => !!value || "Requerido.",
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return pattern.test(value) || "Correo Inválido.";
      },
    },
    error: null,
    search: "",
    editedIndex: -1,
    clientModel: new ClientModel(),
    passwordAnt: "",
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Cliente" : "Actualizar Cliente";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
      if (this.$refs.form != undefined) this.$refs.form.resetValidation();
    },
  },
  mounted() {},
  created() {
    this.getClients();
  },
  methods: {
    displayNotification(type, message) {
      this.$swal.fire({
        position: "top-end",
        type: type,
        title: message,
        showConfirmButton: false,
        timer: 1500,
      });
    },
    async getClients() {
      this.clients = [];
      const querySnapshot = await getDocs(
        collection(db, "profiles/" + auth.currentUser.uid + "/clients")
      );
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        this.clients.push({
          id: doc.data().id,
          name: doc.data().name,
          phone: doc.data().phone,
        });
      });
    },

    editItem(item) {
      this.editedIndex = this.clients.indexOf(item);
      this.clientModel = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {},

    async save() {
      if (this.$refs.form.validate()) {
        const clientssRef = collection(db, "profiles");

        
          setDoc(
            doc(
              clientssRef,
              auth.currentUser.uid,
              "clients",
              this.clientModel.id
            ),
            {
              id: this.clientModel.id,
              name: this.clientModel.name,
              phone: phoneNumberFormatter(this.clientModel.phone),
            }
          )
            .then(() => {
              this.close();
              this.getClients();
              this.clean();
              this.displayNotification(
                "success",
                "Se realizó la operación correctamente."
              );
            })
            .catch(function (error) {
              me.displayNotification("error", error.message);
            });
        
      }
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.clientModel = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    clean() {
      this.clientModel = new ClientModel();
    },
  },
};
</script>
