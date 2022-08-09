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
              :loading="loadingSendSingleBtn"
              :disabled="disableSendSingleBtn"
              color="orange"
              class="ma-2 white--text"
              @click="showMessageSingleModal"
            >
              Mensaje Prueba
              <v-icon right dark>mdi-test-tube</v-icon>
            </v-btn>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  :loading="loadingSendBtn"
                  :disabled="disableSendBtn"
                  color="green"
                  class="ma-2 white--text"
                  @click="showMessageModal"
                >
                  Enviar Masivo
                  <v-icon right dark>mdi-send</v-icon>
                </v-btn>
              </template>
              <span>{{ toolTipMassive }}</span>
            </v-tooltip>
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
            <span class="headline">{{headerModalMessage}}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    v-if="showPhoneOnModal"
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
                    :hint=hintMessage
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
      { text: "Estatus", sortable: true, value: "status" },
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
    loadingSendSingleBtn: false,
    disableSendSingleBtn: false,
    fileProcessed: null,
    file: null,
    uploadModal: false,
    messageModal: false,
    rules: {
      required: (value) => !!value || "Requerido.",
    },
    url: null,
    toolTipMassive: "Debe subir una plantilla",
    showPhoneOnModal: true,
    headerModalMessage: "",
    hintMessage:"",
  }),
  watch: {
    messageModal(val) {
      val || this.closeMessageModal();
      if (this.$refs.form != undefined) this.$refs.form.resetValidation();
    },
    items(val) {
      this.toolTipMassive = "Enviar mensaje masivo a clientes.";
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
        timer: 2500,
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
            me.displayNotification(
              "error",
              "No se pudo procesar el archivo, revise el formato."
            );
            return;
          }

          me.file = null;
          me.uploadModal = false;
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

    async showMessageSingleModal() {
      this.headerModalMessage = "Mensaje de Prueba"
      this.hintMessage = "Insertar texto.";
      this.showPhoneOnModal = true;
      this.messageModal = true;
    },

    async showMessageModal() {
      
        // if (this.items.length == 0) {
        //   this.displayNotification(
        //     "info",
        //     "Debe cargar una plantilla para poder enviar mensajes."
        //   );
        //   return;
        // }
        this.headerModalMessage = "Mensaje Masivo"
        this.hintMessage = "Lo que está dentro de llaves {} debe ser un campo de la tabla";
        this.showPhoneOnModal = false;
        this.messageModal = true;
        this.messageModel.message = "¡Hola {nombre} 👋🏻!, Te escribimos de *Domex Herrera*📦 para informarte que tu(s) paquete(s) está(n) disponible(s)🎉.\n\nPuedes pagar por nuestra web o app para enviarte tu(s) paquete(s) a domicilio 🚚 *GRATIS* o puede pasarlo a retirar por la sucursal 🙌🏻.";
      
    },

    async sendWSSingleMessage() {
      if (this.$refs.form.validate()) {
        this.disableSendSingleBtn = true;
        this.loadingSendSingleBtn = true;
        let me = this;

        await axios
          .post(me.url + "/send-message", {
            number: "1" + me.messageModel.phone,
            message: me.messageModel.message,
          })
          .then(function (response) {
            me.closeMessageModal();
            me.displayNotification("success", "Se envió el mensaje.");
          })
          .catch(function (error) {
            me.displayNotification(
              "error",
              "Verifique la configuración del servidor o el número de telefono."
            );
          });
        this.disableSendSingleBtn = false;
        this.loadingSendSingleBtn = false;
        this.closeMessageModal();
      }
    },

    async sendWSMassiveMessage() {
      this.disableSendBtn = true;
      this.loadingSendBtn = true;

      this.items.forEach((a) => {
        let message = this.prepareSendWSMessage(a.name);
        axios.post("/send-message", {
          number: "1" + a.phone,
          message: message,
        });
      });
      // this.displayNotification(
      //   "success",
      //   "Se envió el mensaje a los clientes."
      // );
      this.disableSendBtn = false;
      this.loadingSendBtn = false;
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
