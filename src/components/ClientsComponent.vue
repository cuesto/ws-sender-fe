<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :search="search"
        :items="clients"
        :loading="loadingtable"
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
                  <v-icon left dark>person_add</v-icon>Agregar
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
                    <v-btn color="green" dark text @click="save">
                      <v-icon left>save</v-icon>Guardar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>
            <v-dialog v-model="uploadModal" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn
                  :loading="loadingUploadBtn"
                  :disabled="disableUploadBtn"
                  color="orange"
                  dark
                  v-on="on"
                  class="mx-3"
                >
                  <v-icon left dark>mdi-cloud-upload</v-icon>Importar
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Importar Clientes</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-file-input
                        v-model="file"
                        accept="file/*.csv"
                        label="Cargar plantilla .csv"
                      ></v-file-input>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ma-2"
                            v-bind="attrs"
                            v-on="on"
                            href="template.csv"
                            dark
                            download
                          >
                            <v-icon dark> mdi-cloud-download </v-icon>
                          </v-btn>
                        </template>
                        <span>Descargar Plantilla</span>
                      </v-tooltip>
                      <v-spacer></v-spacer>
                    </v-row>
                    <v-row>
                      <v-btn
                        @click="UploadClientsTemplate()"
                        color="orange"
                        dark
                      >
                        <v-icon left>mdi-cloud-upload</v-icon>Importar
                      </v-btn>
                      <v-btn
                        class="mx-3"
                        @click="hideUploadModal()"
                        color="blue darken-1"
                        text
                        >Cancelar</v-btn
                      >
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
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
  deleteDoc,
  collection,
} from "firebase/firestore";
import ClientModel from "../models/ClientModel";
import { mask } from "vue-the-mask";
import Papa from "papaparse";
const { phoneNumberFormatter } = require("../helpers/formatter");

const auth = getAuth();
const db = getFirestore(firebaseApp);
const clientssRef = collection(db, "profiles");

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
    },
    search: "",
    editedIndex: -1,
    clientModel: new ClientModel(),
    fileProcessed: null,
    file: null,
    uploadModal: false,
    loadingUploadBtn: false,
    disableUploadBtn: false,
    loadingtable:false
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

    UploadClientsTemplate() {
      if (this.file == null) {
        this.displayNotification(
          "error",
          "El archivo es de un formato incorrecto o no se ha cargado."
        );
        return;
      }

      this.loadingUploadBtn = true;
      this.uploadModal = false;

      let me = this;
      let customersList = [];

      Papa.parse(this.file, {
        header: true,
        complete: function (results) {
          me.fileProcessed = results.data;
          customersList = results.data.map((a) => {
            return {
              id: a.Id,
              name: a.Nombre,
              phone: a.Celular,
            };
          });

          customersList = customersList.filter(
            (x) =>
              x.id != undefined &&
              x.id != "" &&
              x.name != undefined &&
              x.name != "" &&
              x.phone != undefined &&
              x.phone != ""
          );

          if (customersList.length == 0) {
            me.displayNotification(
              "error",
              "No se pudo procesar el archivo, revise el formato."
            );
            return;
          }
          console.log(customersList);
          customersList.forEach((a) => {
            setDoc(doc(clientssRef, auth.currentUser.uid, "clients", a.id), {
              id: a.id,
              name: a.name,
              phone: phoneNumberFormatter(a.phone),
            })
              .then(() => {})
              .catch((error) => {
                console.log(error.message);
                me.loadingUploadBtn = false;
              });
          });
        },
      });

      me.loadingUploadBtn = false;
      me.file = null;

      me.displayNotification(
        "success",
        "Se cargaron los registros correctamente."
      );
      me.getClients();
    },

    async getClients() {
      this.loadingtable = true;
      this.clients = [];
      const querySnapshot = await getDocs(
        collection(db, "profiles/" + auth.currentUser.uid + "/clients")
      );
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        this.clients.push({
          id: doc.data().id,
          name: doc.data().name,
          phone: doc.data().phone,
        });
      });
      this.loadingtable = false;
    },

    editItem(item) {
      this.editedIndex = this.clients.indexOf(item);
      this.clientModel = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.$swal
        .fire({
          title: "¿Está Seguro de Eliminar este registro?",
          text: "¡No será posible revertir el cambio!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          confirmButtonText: "¡Borrar!",
          cancelButtonText: "Cancelar",
        })
        .then((result) => {
          if (result.value) {
            deleteDoc(
              doc(clientssRef, auth.currentUser.uid, "clients", item.id)
            )
              .then(() => {
                this.close();
                this.getClients();
                this.clean();
                this.displayNotification(
                  "success",
                  "Se eliminó el registro correctamente."
                );
              })
              .catch(function (error) {
                this.displayNotification("error", error.message);
              });
          }
        });
    },

    async save() {
      if (this.$refs.form.validate()) {
        setDoc(
          doc(
            clientssRef,
            auth.currentUser.uid,
            "clients",
            this.clientModel.id
          ),
          this.clientModel
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
            this.displayNotification("error", error.message);
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

    hideUploadModal() {
      this.uploadModal = false;
      this.file = null;
    },
  },
};
</script>
