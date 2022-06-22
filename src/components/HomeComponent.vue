<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :search="search"
        :items="items"
        class="elevation-1"
        :items-per-page="50"
        :footer-props="{ 'items-per-page-options': [50, 100, 250, 500] }"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Clientes</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-btn
              :loading="loadingUploadBtn"
              :disabled="disableUploadBtn"
              color="blue"
              class="ma-2 white--text"
              @click="showUploadModal"
            >
              Cargar
              <v-icon right dark> mdi-cloud-upload </v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field
              class="text-xs-center"
              v-model="search"
              append-icon="search"
              label="Buscar"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-btn
              :loading="loadingSendBtn"
              :disabled="disableSendBtn"
              color="green"
              class="ma-2 white--text"
              @click="sendWSMessage"
            >
              Enviar Mensaje
              <v-icon right dark> mdi-send</v-icon>
            </v-btn>
          </v-toolbar>
        </template>
      </v-data-table>
    </v-flex>
    <v-dialog v-model="uploadModal" max-width="500px">
      <v-card>
        <v-card-text>
          <template>
            <v-file-input
              v-model="file"
              accept="file/*.csv"
              label="Cargar Plantilla"
            ></v-file-input>
            <v-btn @click="UploadClientsTemplate()" color="blue" dark>
              <v-icon left>mdi-cloud-upload</v-icon>Cargar
            </v-btn>
            <v-btn @click="hideUploadModal()" color="blue darken-1" text
              >Cancelar</v-btn
            >
          </template>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import Papa from "papaparse";
import InventoryItemModel from "../models/InventoryItemModel";
import axios from "axios";

export default {
  components: {},
  data: () => ({
    headers: [
      { text: "Codigo", sortable: true, value: "code" },
      { text: "Nombre", sortable: true, value: "name" },
      { text: "Celular", sortable: true, value: "phone" },
    ],
    items: [],
    code: "",
    name: "",
    search: "",
    inventoryItemModel: new InventoryItemModel(),
    loadingUploadBtn: false,
    disableUploadBtn: false,
    loadingSendBtn: false,
    disableSendBtn: false,
    fileProcessed: null,
    file: null,
    uploadModal: false,
  }),
  watch: {},
  mounted() {},
  created() {
    //this.getClients();
  },
  methods: {
    displayNotification(type, message) {
      this.$swal.fire({
        position: "top-end",
        type: type,
        title: message,
        showConfirmButton: false,
        timer: 1000,
      });
    },

    getClients() {
      console.log("getClients");
      //https://sheets.googleapis.com/v4/spreadsheets/1D7Xt6sK2we1z6mdxjLssCUgyGLJRlmHeOaZEYhe2BLU/values/Clientes-Limpio!A:C?key=AIzaSyCVWCtIuxgTA8GLfOJYz9PwDgBeBIE5fPQ
      axios
        .get("https://sheets.googleapis.com/v4/spreadsheets/1D7Xt6sK2we1z6mdxjLssCUgyGLJRlmHeOaZEYhe2BLU/values/Clientes-Limpio!A:C?key=AIzaSyCVWCtIuxgTA8GLfOJYz9PwDgBeBIE5fPQ")
        .then((response) => {
          //this.items = response.data;
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    UploadClientsTemplate() {
      if (this.file == null) {
        //alert("El archivo es de un formato incorrecto o no se ha cargado.");
        this.displayNotification(
          "error",
          "El archivo es de un formato incorrecto o no se ha cargado."
        );
        return;
      }

      let me = this;

      Papa.parse(this.file, {
        header: true,
        complete: function (results) {
          me.fileProcessed = results.data;
          var customersList = results.data.map((a) => {
            return {
              code: a.Codigo,
              name: a.Nombres,
              phone: a.TelCelular,
            };
          });

          customersList = customersList.filter(
            (x) =>
              x.code != undefined &&
              x.code != "" &&
              x.name != undefined &&
              x.name != "" &&
              x.phone != undefined &&
              x.phone != ""
          );

          if (customersList.length == 0) {
            // alert(
            //   "No se pudo procesar el archivo, revise el formato o los datos."
            // );
            me.displayNotification(
              "error",
              "No se pudo procesar el archivo, revise el formato."
            );
            return;
          }

          me.uploadModal = false;
          //alert(".Se cargaron los registros correctamente");
          me.displayNotification(
            "success",
            "Se cargaron los registros correctamente."
          );

          customersList.forEach((a) => {
            me.items.push({ code: a.code, name: a.name, phone: a.phone });
          });
        },
      });
    },

    async showUploadModal() {
      this.uploadModal = true;
    },

    async sendWSMessage() {
      this.disableSendBtn = true;
      this.items.forEach((a) => {
        let message = this.prepareSendWSMessage(a.name);
        axios.post("/send-message", {
          number: "1" + a.phone,
          message: message,
        });
      });
      this.displayNotification(
        "success",
        "Se envió el mensaje a los clientes."
      );
      this.disableSendBtn = false;
      //await axios.post("/send-message", { number: number, message: message });
    },

    prepareSendWSMessage(name) {
      let message =
        "¡Hola " +
        name +
        "!, Te escribimos de *Domex Herrera* para informarte que tu(s) paquete(s) está(n) disponible(s).\n\nPuedes pagar por nuestra web o app para enviarte tu(s) paquete(s) a domicilio *GRATIS* o puede pasarlo a retirar por la sucursal.";
      return message;
    },

    hideUploadModal() {
      this.uploadModal = false;
      this.file = null;
    },
  },
};
</script>
