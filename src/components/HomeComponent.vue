<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
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
              color="green"
              class="ma-2 white--text"
              @click="showUploadModal"
            >
              Cargar
              <v-icon right dark> mdi-cloud-upload </v-icon>
            </v-btn>
            <v-btn
              :loading="loadingDownloadBtn"
              :disabled="disableDownloadBtn"
              color="red"
              class="ma-2 white--text"
              @click="downloadString"
            >
              Descargar
              <v-icon right dark> mdi-cloud-download </v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field
              class="text-xs-center"
              v-model="code"
              append-icon="mdi-barcode"
              label="Paquete"
              single-line
              hide-details
              v-on:keyup="validateKeyPressed"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-chip class="ma-2" color="green" outlined>
              Ubicación :
              <b>{{ name }}</b>
            </v-chip>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <!-- <template v-slot:item.options="{ item }"> -->
          <v-icon size="sm" color="red" class="mr-1" @click="deleteItem(item)"
            >mdi-delete</v-icon
          >
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
      { text: "Opciones", value: "options", sortable: false },
    ],
    items: [],
    code: "",
    name: "",

    inventoryItemModel: new InventoryItemModel(),
    loadingUploadBtn: false,
    disableUploadBtn: false,
    loadingDownloadBtn: false,
    disableDownloadBtn: true,
    fileProcessed: null,
    file: null,
    uploadModal: false,
  }),
  watch: {},
  mounted() {},

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
    validateKeyPressed(e) {
      if (e.keyCode === 13) {
        this.addcode();
      }
    },

    UploadClientsTemplate() {
      if (this.file == null) {
        alert("El archivo es de un formato incorrecto o no se ha cargado.");
        // this.displayNotification(
        //   "error",
        //   "El archivo es de un formato incorrecto o no se ha cargado."
        // );
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
            alert(
              "No se pudo procesar el archivo, revise el formato o los datos."
            );
            //me.displayNotification("error", "No se pudo procesar el archivo, revise el formato.");
            return;
          }

          me.uploadModal = false;
          alert("Se cargaron los registros correctamente.");
            me.displayNotification("error", "No se pudo procesar el archivo, revise el formato.");


          customersList.forEach((a) => {
            me.items.push({ code: a.code, name: a.name, phone: a.phone });
          });
        },
      });
    },

    async showUploadModal() {
      this.uploadModal = true;
  //     await axios
  //       .post("/send-message", { number: "18096019002", message: "Hola Mundo" },{
  //  headers: {
          
  //       }
  //     })
  //       .then(function (response) {
  //         if (response.data.result == "ERROR") {
  //           console.log(response.data.message);
  //         } else {
  //           console.log(response.data.message);
  //         }
  //       })
  //       .catch(function (error) {
  //         console.log(error.message);
  //       });
  // this.sendWSMessage("18096019002","Hola Mundo!, Este es un mensaje de prueba de la nueva APP de envio de mensajes por WS"); 
  // this.sendWSMessage("18093191124","Hola Mundo!, Este es un mensaje de prueba de la nueva APP de envio de mensajes por WS");
  // this.sendWSMessage("18098652939","Hola Mundo!, Este es un mensaje de prueba de la nueva APP de envio de mensajes por WS");
  // this.sendWSMessage("18297254980","Hola Mundo!, Este es un mensaje de prueba de la nueva APP de envio de mensajes por WS");

    },
   
    async sendWSMessage(number,message) {
      await axios
        .post("/send-message", { number: number, message: message });
    },
    
    hideUploadModal() {
      this.uploadModal = false;
      this.file = null;
    },

    addcode() {
      let firstLetter = this.code.charAt(0);

      if (
        this.items.length == 0 &&
        firstLetter != "." &&
        this.name === ""
      ) {
        alert("Específique ubicación");
        //this.displayNotification("error", "Especifique Ubicación.");
        this.cleancode();
        return;
      }

      if (this.items.length == 0 && firstLetter === ".") {
        this.name = this.code;
        this.cleancode();
        return;
      }

      if (this.items.length > 0 && firstLetter === ".") {
        this.name = this.code;
        this.cleancode();
        return;
      }

      this.items.push({ code: this.code, name: this.name });

      if (this.disableDownloadBtn) this.disableDownloadBtn = false;

      this.cleancode();
    },
    cleancode() {
      this.code = "";
    },

    downloadString() {
      let text = this.getInventoryItemFormatString();
      let fileType = "text";
      let fileName = "archivoinventario.txt";

      var blob = new Blob([text], { type: fileType });
      console.log(text);
      var a = document.createElement("a");
      a.download = fileName;
      a.href = URL.createObjectURL(blob);
      a.dataset.downloadurl = [fileType, a.download, a.href].join(":");
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () {
        URL.revokeObjectURL(a.href);
      }, 1500);
    },

    getInventoryItemFormatString() {
      let result = "";

      let names = [...new Set(this.items.map((x) => x.name))];

      names.forEach((x) => {
        result = result + x + "\n";

        let codes = this.items
          .filter((y) => x == y.name)
          .map((a) => {
            return a.code;
          });

        codes.forEach((z) => {
          result = result + z + "\n";
        });
      });

      console.log(result);
      return result;
    },
  },
};
</script>
