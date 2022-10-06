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
        dense
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
                <v-btn color="blue" dark v-on="on">
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
                        <v-col cols="12" sm="12" md="12">
                          <v-textarea
                            label="Contenido"
                            :rules="[rules.required]"
                            append-icon="mdi-comment-text"
                            v-model="campaignModel.content"
                          ></v-textarea>
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
        <template #[`item.options`]="{ item }">
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
        <template #[`item.content`]="{ item }">
          <v-textarea disabled v-model="item.content"> </v-textarea>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-container>
            <v-row justify="center" align="center">
              <v-btn
                color="brown"
                dark
                class="my-4"
                @click="showSingleMessageModal(item)"
                block
              >
                Mensaje Individual
              </v-btn>
            </v-row>
            <v-row justify="center" align="center">
              <v-btn color="indigo" dark @click="showMessageModal(item)" block
                >Campaña
              </v-btn>
            </v-row>
          </v-container>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="getCampaigns">
            <v-icon left dark>autorenew</v-icon>Refrescar
          </v-btn>
        </template>
      </v-data-table>
      <v-dialog v-model="messageModal" persistent max-width="1000px">
        <v-card class="mx-auto">
          <v-card-title>
            <span class="headline">{{ campaignModel.name }}</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="closeMessageModal()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-container fluid>
              <v-row dense>
                <v-col cols="6">
                  <v-card class="pa-md-4 mx-lg-auto">
                    <v-text-field
                      label="Id Campaña"
                      v-model="campaignModel.id"
                      disabled
                      single-line
                    ></v-text-field>
                    <v-textarea
                      label="Mensaje"
                      v-model="campaignModel.content"
                    ></v-textarea>
                    <v-text-field
                      v-if="showPhoneOnModal"
                      label="Celular"
                      hint="8094445555"
                      v-mask="mask"
                      :rules="[rules.required]"
                      v-model="messageModel.phone"
                      single-line
                    ></v-text-field>
                    <v-file-input
                      v-model="file"
                      accept="file/*.jpg"
                      label="Anexar Imagen"
                    ></v-file-input>
                  </v-card>
                </v-col>
                <v-col cols="5">
                  <v-card class="pa-md-4 mx-lg-auto">
                    <v-virtual-scroll
                      :items="items"
                      height="345"
                      item-height="55"
                    >
                      <template v-slot:default="{ item }">
                        <v-list>
                          <v-list-item :key="item">
                            <v-list-item-content>
                              <v-list-item-title
                                v-text="item.text"
                              ></v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action>
                              <v-icon
                                small
                                size="sm"
                                variant="outline-info"
                                color="green"
                                class="mr-1"
                                >done</v-icon
                              >
                              <v-icon
                                small
                                size="sm"
                                variant="outline-info"
                                color="red"
                                class="mr-1"
                                >mdi-alert-circle-outline</v-icon
                              >
                            </v-list-item-action>
                          </v-list-item>
                        </v-list>
                      </template>
                    </v-virtual-scroll>

                    <v-btn dark color="blue" class="my-1" block
                      >Enviar mensaje</v-btn
                    >
                  </v-card>
                </v-col>
                <v-col>
                  <v-container>
                    <v-row justify="end" align="center">
                      <v-btn class="my-1" @click="showfilterClientsModal()"
                        ><v-icon dark>mdi-filter</v-icon></v-btn
                      >
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="filterClientsModal" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Buscar Clientes por código</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-textarea v-model="clientsIds"> </v-textarea>
              </v-row>
              <v-row>
                <v-btn
                  color="orange"
                  dark
                  class="my-1"
                  @click="getClientsByIds()"
                >
                  <v-icon left dark>mdi-filter</v-icon>Aplicar</v-btn
                >
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
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
import MessageModel from "../../models/MessageModel";
import { mask } from "vue-the-mask";
//const { phoneNumberFormatter } = require("../../helpers/formatter");

const auth = getAuth();
const db = getFirestore(firebaseApp);
const profilessRef = collection(db, "profiles");

export default {
  directives: {
    mask,
  },
  data: () => ({
    campaigns: [
      {
        id: "CPN001",
        name: "Notificación Paquetes Disponibles",
        content:
          "¡Hola {nombre}! 👋🏻, Te escribimos de *Domex Herrera*📦 para informarte que tu(s) paquete(s) está(n) disponible(s)🎉.\n\nPuedes pagar por nuestra web o app para enviarte tu(s) paquete(s) a domicilio 🚚 *GRATIS* o puede pasarlo a retirar por la sucursal 🙌🏻.",
      },
    ],
    mask: "##########",
    dialog: false,
    headers: [
      { text: "Opciones", value: "options", sortable: false },
      { text: "Id", sortable: true, value: "id" },
      { text: "Nombre", sortable: true, value: "name" },
      { text: "Contenido", sortable: false, value: "content" },
      { text: "Acciones", value: "actions", sortable: false, align: "center" },
    ],
    rules: {
      required: (value) => !!value || "Requerido.",
    },
    search: "",
    editedIndex: -1,
    campaignModel: new CampaignModel(),
    loadingtable: false,
    messageModal: false,
    messageModel: new MessageModel(),
    headerModalMessage: "",
    file: null,
    showPhoneOnModal: true,
    items: [
      { text: "Real-Time", icon: "mdi-clock" },
      { text: "Audience", icon: "mdi-account" },
      { text: "Conversions", icon: "mdi-flag" },
      { text: "Real-Time", icon: "mdi-clock" },
      { text: "Audience", icon: "mdi-account" },
      { text: "Conversions", icon: "mdi-flag" },
      { text: "Real-Time", icon: "mdi-clock" },
      { text: "Audience", icon: "mdi-account" },
      { text: "Conversions", icon: "mdi-flag" },
      { text: "Real-Time", icon: "mdi-clock" },
      { text: "Audience", icon: "mdi-account" },
      { text: "Conversions", icon: "mdi-flag" },
      { text: "Real-Time", icon: "mdi-clock" },
      { text: "Audience", icon: "mdi-account" },
      { text: "Conversions", icon: "mdi-flag" },
      { text: "Real-Time", icon: "mdi-clock" },
      { text: "Audience", icon: "mdi-account" },
      { text: "Conversions", icon: "mdi-flag" },
      { text: "Real-Time", icon: "mdi-clock" },
      { text: "Audience", icon: "mdi-account" },
      { text: "Conversions", icon: "mdi-flag" },
      { text: "Real-Time", icon: "mdi-clock" },
      { text: "Audience", icon: "mdi-account" },
      { text: "Conversions", icon: "mdi-flag" },
      { text: "Real-Time", icon: "mdi-clock" },
      { text: "Audience", icon: "mdi-account" },
      { text: "Conversions", icon: "mdi-flag" },
      { text: "Real-Time", icon: "mdi-clock" },
      { text: "Audience", icon: "mdi-account" },
      { text: "Conversions", icon: "mdi-flag" },
      { text: "Real-Time", icon: "mdi-clock" },
      { text: "Audience", icon: "mdi-account" },
      { text: "Conversions", icon: "mdi-flag" },
      { text: "Real-Time", icon: "mdi-clock" },
      { text: "Audience", icon: "mdi-account" },
      { text: "Conversions", icon: "mdi-flag" },
    ],
    clients: [],
    filterClientsModal: false,
    clientsIds:
      "D01-270782\nD01-098634\nD01-266253\nD01-266253\nD01-266253\nD01-266253\n\n\n",
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
      val || this.closeMessageModal();
      // if (this.$refs.formCampaign != undefined)
      //   this.$refs.formCampaign.resetValidation();
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

    async getClients() {
      this.clients = [
        {
          id: "D01-264423",
          name: "Shamelis",
          phone: "8096015222",
        },
        {
          id: "D01-098634",
          name: "Shamelis",
          phone: "8096015222",
        },
        {
          id: "D01-266253",
          name: "Shamelis",
          phone: "8096015222",
        },
      ];
    },

    async getClientsByIds() {
      this.filterClientsModal = false;
      let clientsIdsArray;
      clientsIdsArray = this.clientsIds.split("\n");
      clientsIdsArray = [...new Set(clientsIdsArray)];
      clientsIdsArray = clientsIdsArray.filter(function (el) {
        return el != "";
      });

      console.log(clientsIdsArray);

      const querySnapshot = await getDocs(
        collection(db, "profiles/" + auth.currentUser.uid + "/clients", where('id', 'in', clientsIdsArray))
      );
      querySnapshot.forEach((doc) => {
        this.clients.push({
          id: doc.data().id,
          name: doc.data().name,
          phone: doc.data().phone,
        });
      });

      console.log(this.clients);

      // let clients = this.getClients();
      // //clientsIdsArray.forEach()
      // //myArray.find(x => x.id === '45').foo;
      // var a = clients.find(x=>x.id ==="D01-266253");
      // console.log(a)
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

    showSingleMessageModal(item) {
      this.campaignModel.name = item.name;
      this.campaignModel.id = item.id;
      this.campaignModel.content = item.content;

      this.messageModal = true;
      //this.showPhoneOnModal = true;
    },

    showMessageModal(item) {
      this.campaignModel.name = item.name;
      this.campaignModel.id = item.id;
      this.campaignModel.content = item.content;

      this.messageModal = true;
      //this.showPhoneOnModal = false;

      this.messageModel.message =
        "¡Hola {nombre}! 👋🏻, Te escribimos de *Domex Herrera*📦 para informarte que tu(s) paquete(s) está(n) disponible(s)🎉.\n\nPuedes pagar por nuestra web o app para enviarte tu(s) paquete(s) a domicilio 🚚 *GRATIS* o puede pasarlo a retirar por la sucursal 🙌🏻.";
    },

    showfilterClientsModal() {
      this.filterClientsModal = true;
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.campaignModel = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    closeMessageModal() {
      this.messageModal = false;
      setTimeout(() => {
        this.messageModel = Object.assign({}, this.defaultItem);
      }, 300);
    },

    clean() {
      this.campaignModel = new CampaignModel();
    },
  },
};
</script>
