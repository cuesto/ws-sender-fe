<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :search="search"
        :items="campaigns"
        :loading="loadingtable"
        sort-by="name"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Campañas</v-toolbar-title>
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
                  <v-icon left dark>person_add</v-icon>Agregar Plantilla
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
                            label="Id*"
                            :rules="[rules.required]"
                            v-model="campaignModel.id"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            label="Nombre*"
                            :rules="[rules.required]"
                            v-model="campaignModel.name"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            label="Contenido*"
                            :rules="[rules.required]"
                            v-model="campaignModel.content"
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
          <v-btn color="primary" @click="getCampaigns">
            <v-icon left dark>autorenew</v-icon>Refrescar
          </v-btn>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>
<script>
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../../firebase";
import {
  getFirestore,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  collection,
} from "firebase/firestore";
import CampaignModel from "../../models/CampaignModel";
import { mask } from "vue-the-mask";
const { phoneNumberFormatter } = require("../../helpers/formatter");

const auth = getAuth();
const db = getFirestore(firebaseApp);
const profilessRef = collection(db, "profiles");

export default {
  directives: {
    mask,
  },
  data: () => ({
    campaigns: [],
    mask: "##########",
    dialog: false,
    headers: [
      { text: "Id", sortable: true, value: "id" },
      { text: "Nombre", sortable: true, value: "name" },
      { text: "Contenido", sortable: false, value: "content" },
      { text: "Opciones", value: "actions", sortable: false },
    ],
    rules: {
      required: (value) => !!value || "Requerido.",
    },
    search: "",
    editedIndex: -1,
    campaignModel: new CampaignModel(),
    loadingtable: false,
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Nueva Plantilla"
        : "Actualizar Plantilla";
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
    //this.getCampaigns();
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

    async getCampaigns() {
      this.loadingtable = true;
      this.campaigns = [];
     
      const querySnapshot = await getDocs(
        collection(db, "profiles/" + auth.currentUser.uid + "/campaigns")
      );
      querySnapshot.forEach((doc) => {
        this.campaigns.push({
          id: doc.data().id,
          name: doc.data().name,
          content: doc.data().content,
        });
      });
      this.loadingtable = false;
    },

    editItem(item) {
      this.editedIndex = this.campaigns.indexOf(item);
      this.campaignModel = Object.assign({}, item);
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
              doc(profilessRef, auth.currentUser.uid, "campaigns", item.id)
            )
              .then(() => {
                this.close();
                //this.getCampaigns();
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
            profilessRef,
            auth.currentUser.uid,
            "campaigns",
            this.campaignModel.id
          ),
          {
            id: this.campaignModel.id,
            name: this.campaignModel.name,
            content: this.campaignModel.content,
          }
        )
          .then(() => {
            this.close();
            //this.getCampaigns();
            this.clean();
            this.displayNotification(
              "success",
              "Se realizó la operación correctamente."
            );
          })
          .catch(function (error) {
            console.log(error);
            this.displayNotification("error", error.message);
          });
      }
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.campaignModel = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    clean() {
      this.campaignModel = new CampaignModel();
    },
  },
};
</script>
