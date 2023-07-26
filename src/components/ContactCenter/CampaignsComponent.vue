<template>
<v-layout align-start>
    <v-flex>
        <v-data-table :headers="headers" :search="search" :items="campaigns" :loading="loadingtable" sort-by="id" class="elevation-1" dense>
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Campañas</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
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
                                                <v-text-field label="Id*" :rules="[rules.required]" v-model="campaignModel.id"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field label="Nombre*" :rules="[rules.required]" v-model="campaignModel.name"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-textarea label="Contenido" :rules="[rules.required]" append-icon="mdi-comment-text" v-model="campaignModel.content"></v-textarea>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                    <small>*Campo requerido.</small>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="dialog = false">Cerrar</v-btn>
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
                <v-icon size="sm" variant="outline-info" color="blue" class="mr-1" @click="editItem(item)">edit</v-icon>
                <v-icon size="sm" color="red" class="mr-1" @click="deleteItem(item)">delete</v-icon>
            </template>
            <template #[`item.content`]="{ item }">
                <v-textarea disabled v-model="item.content"> </v-textarea>
            </template>
            <template #[`item.actions`]="{ item }">
                <v-container>
                    <v-row justify="center" align="center">
                        <v-btn color="#ee0290" dark @click="showMessageModal(item)" block>
                            <v-icon left dark>mdi-rocket-launch</v-icon>Lanzar Campaña
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
        <v-dialog v-model="messageModal" persistent max-width="1200px">
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
                                    <v-text-field label="Id Campaña" v-model="campaignModel.id" disabled single-line></v-text-field>
                                    <v-textarea label="Mensaje" v-model="campaignModel.content"></v-textarea>
                                    <v-text-field label="Celular" hint="8094445555" v-mask="mask" :rules="[rules.required]" v-model="phone" single-line :disabled="!isSingleMessage"></v-text-field>
                                    <v-switch v-model="isSingleMessage" label="Enviar único mensaje"></v-switch>
                                    <v-file-input v-model="file" accept="file/*.jpg" label="Anexar Imagen"></v-file-input>
                                </v-card>
                            </v-col>
                            <v-col cols="5">
                                <v-card class="pa-md-4 mx-lg-auto">
                                    <v-virtual-scroll :items="filteredClients" height="410" item-height="55">
                                        <template v-slot:default="{ item }">
                                            <v-list>
                                                <v-list-item :key="item.id">
                                                    <v-list-item-content>
                                                        <v-list-item-title v-text="
                                  item.id +
                                  ' - ' +
                                  item.name +
                                  ' - ' +
                                  item.phone
                                "></v-list-item-title>
                                                    </v-list-item-content>
                                                    <v-list-item-action>
                                                        <v-icon v-if="item.isSent" small size="sm" variant="outline-info" color="green" class="mr-1">done</v-icon>
                                                        <v-icon v-if="item.hasError" small size="sm" variant="outline-info" color="red" class="mr-1">mdi-alert-circle-outline</v-icon>
                                                    </v-list-item-action>
                                                </v-list-item>
                                            </v-list>
                                        </template>
                                    </v-virtual-scroll>

                                    <v-btn dark color="green" class="my-1" block @click="sendMessage()" :loading="loadingSendBtn">Enviar mensaje
                                        <v-icon right dark>mdi-send</v-icon>
                                    </v-btn>
                                </v-card>
                            </v-col>
                            <v-col>
                                <v-container>
                                    <v-row justify="end" align="center">
                                        <v-btn class="my-1" @click="showfilterClientsModal()" :disabled="isSingleMessage">
                                            <v-icon dark>mdi-filter</v-icon>
                                        </v-btn>
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
                            <v-btn color="orange" dark class="my-1" @click="getClientsByIds()">
                                <v-icon left dark>mdi-filter</v-icon>Aplicar
                            </v-btn>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-flex>
</v-layout>
</template>

<script>
import {
    getAuth,
    onAuthStateChanged
} from "firebase/auth";
import {
    firebaseApp
} from "../../firebase";
import {
    getFirestore,
    doc,
    getDoc,
    getDocs,
    getDocsFromCache,
    setDoc,
    deleteDoc,
    collection,
} from "firebase/firestore";
import CampaignModel from "../../models/CampaignModel";
import {
    mask
} from "vue-the-mask";
import axios from "axios";

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
        headers: [{
                text: "Opciones",
                value: "options",
                sortable: false,
            },
            {
                text: "Id",
                sortable: true,
                value: "id",
            },
            {
                text: "Nombre",
                sortable: true,
                value: "name",
            },
            {
                text: "Contenido",
                sortable: false,
                value: "content",
            },
            {
                text: "Acciones",
                value: "actions",
                sortable: false,
                align: "center",
            },
        ],
        rules: {
            required: (value) => !!value || "Requerido.",
        },
        search: "",
        editedIndex: -1,
        campaignModel: new CampaignModel(),
        loadingtable: false,
        messageModal: false,
        headerModalMessage: "",
        file: null,
        clients: [],
        filteredClients: [],
        filterClientsModal: false,
        isSingleMessage: false,
        clientsIds: "",
        loadingSendBtn: false,
        phone: "",
        url: "",
    }),
    computed: {
        formTitle() {
            return this.editedIndex === -1 ?
                "Nueva Plantilla" :
                "Actualizar Plantilla";
        },
    },
    watch: {
       
    },
    mounted() {},
    created() {
        this.getCampaigns();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.getUserData(user.uid);
            }
        });
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

        async getUserData(uid) {
            const userRef = doc(db, "profiles", uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                this.url = userSnap.data().server;
            } else {
                console.log("No such document!");
            }
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
            const querySnapshot = await getDocs(
                collection(db, "profiles/" + auth.currentUser.uid + "/clients")
            );
            querySnapshot.forEach((doc) => {
                this.clients.push({
                    id: doc.data().id,
                    name: doc.data().name,
                    phone: doc.data().phone,
                    isSent: false,
                    hasError: false,
                });
            });
        },

        async getClientsByIds() {
            this.filterClientsModal = false;
            let clientsIdsArray;
            console.log(this.clientsIds)
            this.clientsIds = this.clientsIds.replaceAll(' ', '');
            clientsIdsArray = this.clientsIds.split("\n");
            clientsIdsArray = [...new Set(clientsIdsArray)];
            clientsIdsArray = clientsIdsArray.filter(function (el) {
                return el != "";
            });

            if (this.clients.length == 0) {
                await this.getClients();
            }

            this.filteredClients = this.clients.filter((client) =>
                clientsIdsArray.includes(client.id)
            );
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
                                this.getCampaigns();
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
                        ), {
                            id: this.campaignModel.id,
                            name: this.campaignModel.name,
                            content: this.campaignModel.content,
                        }
                    )
                    .then(() => {
                        this.close();
                        this.getCampaigns();
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

        sendMessage() {
            this.$swal
                .fire({
                    title: "¿Está Seguro de enviar este mensaje?",
                    text: "¡No será posible revertir el cambio!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    confirmButtonText: "¡Enviar!",
                    cancelButtonText: "Cancelar",
                })
                .then((result) => {
                    if (result.value) {
                        this.sendWSMessage();
                    }
                });
        },

        async sendWSMessage() {
            this.loadingSendBtn = true;
            let me = this;

            if (this.isSingleMessage) {
                this.filteredClients = [{
                    id: "",
                    name: "",
                    phone: this.phone,
                    isSent: false,
                    hasError: false,
                }, ];
            }

            this.filteredClients.forEach((a) => {
                let message = me.prepareSendWSMessage(a.name);
                axios
                    .post(me.url + "/send-message", {
                        number: "1" + a.phone,
                        message: message,
                    })
                    .then(function (response) {
                        a.isSent = true;
                    })
                    .catch(function (error) {
                        a.hasError = true;
                        console.log(error);
                    });
            });
            setTimeout(() => {
                this.loadingSendBtn = false;
            }, 5000);
        },

        prepareSendWSMessage(name) {
            let message = this.campaignModel.content;
            let newMessage = message.replace("{nombre}", name);
            return newMessage;
        },

        showMessageModal(item) {
            this.campaignModel.name = item.name;
            this.campaignModel.id = item.id;
            this.campaignModel.content = item.content;
            this.filteredClients = [];
            this.messageModal = true;
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
        },

        clean() {
            this.campaignModel = new CampaignModel();
        },
    },
};
</script>
