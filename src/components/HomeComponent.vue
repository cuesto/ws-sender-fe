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
              color="orange"
              class="ma-2 white--text"
              @click="showMessageModal"
            >
              Mensaje Prueba
              <v-icon right dark>mdi-test-tube</v-icon>
            </v-btn>
            <v-btn
              :loading="loadingSendBtn"
              :disabled="disableSendBtn"
              color="green"
              class="ma-2 white--text"
              @click="sendWSMassiveMessage"
            >
              Enviar Mensaje
              <v-icon right dark>mdi-send</v-icon>
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
    <v-dialog v-model="messageModal" persistent max-width="600px">
      <v-form ref="form">
        <v-card>
          <v-card-title>
            <span class="headline">Mensaje de Prueba</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    label="Celular"
                    hint="8094445555"
                    v-mask="mask"
                    :rules="[rules.required]"
                    append-icon="mdi-phone"
                    v-model="messageModel.phone"
                    single-line
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-textarea
                    label="Mensaje"
                    hint="Insertar mensaje"
                    :rules="[rules.required]"
                    append-icon="mdi-comment-text"
                    v-model="messageModel.message"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeMessageModal()"
              >Cerrar</v-btn
            >
            <v-btn color="blue darken-1" text @click="sendWSSingleMessage">
              Enviar<v-icon right dark>mdi-send</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-layout>
</template>

<script>
import Papa from "papaparse";
import MessageModel from "../models/MessageModel";
import axios from "axios";
import { mask } from "vue-the-mask";

export default {
  components: {},
  directives: {
    mask,
  },
  data: () => ({
    mask: "##########",
    headers: [
      { text: "Codigo", sortable: true, value: "code" },
      { text: "Nombre", sortable: true, value: "name" },
      { text: "Celular", sortable: true, value: "phone" },
    ],
    items: [],
    code: "",
    name: "",
    search: "",
    messageModel: new MessageModel(),
    loadingUploadBtn: false,
    disableUploadBtn: false,
    loadingSendBtn: false,
    disableSendBtn: false,
    fileProcessed: null,
    file: null,
    uploadModal: false,
    messageModal: false,
    rules: {
      required: (value) => !!value || "Requerido.",
    },
    url: null,
  }),
  watch: {
    messageModal(val) {
      val || this.closeMessageModal();
      if (this.$refs.form != undefined) this.$refs.form.resetValidation();
    },
  },
  mounted() {},
  created() {
    if (this.$store.state.userProfile) {
      this.url = this.$store.state.userProfile.server;
    }
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

    async showMessageModal() {
      this.messageModal = true;
    },

    async sendWSSingleMessage() {
      this.disableSendBtn = true;
      let me = this;

      console.log(this.messageModel);
      console.log(me.url);
      axios
        .post(me.url + "/send-message", {
          number: "1" + me.messageModel.phone,
          message: me.messageModel.message,
        })
        .then(function (response) {
          me.closeMessageModal();
          me.displayNotification("success", "Se envió el mensaje.");
        })
        .catch(function (error) {
          me.displayNotification("error", error.message);
        });
      this.disableSendBtn = false;
    },

    async sendWSMassiveMessage() {
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
    },

    prepareSendWSMessage(name) {
      let message =
        //"Este mes celebramos a nuestros superhéroes🦸🏻‍♂️ favoritos... ¡Los padres!👨‍👧‍👦💛 Pide tus regalos para papá y tráelo con Domex porque este verano te damos un 22% OFF en flete de 7 libras o más.🙌🏻 \n\n" +
        "Quedan pocos días,🕑 no esperes más... ¡Papá se merece todo en este verano!🌴😉 \n\n" +
        "https://www.instagram.com/p/CgPu9YEpQEZ/";
      "¡Hola " +
        name +
        "!, Te escribimos de *Domex Herrera* para informarte que tu(s) paquete(s) está(n) disponible(s).\n\nPuedes pagar por nuestra web o app para enviarte tu(s) paquete(s) a domicilio *GRATIS* o puede pasarlo a retirar por la sucursal.";
      return message;
    },

    hideUploadModal() {
      this.uploadModal = false;
      this.file = null;
    },

    closeMessageModal() {
      this.messageModal = false;
      setTimeout(() => {
        this.messageModel = Object.assign({}, this.defaultItem);
      }, 300);
    },
  },
};
</script>
