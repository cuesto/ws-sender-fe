<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        sort-by="location"
        class="elevation-1"
        :items-per-page="10"
        :footer-props="{ 'items-per-page-options': [10, 15, 20, 25] }"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Conteo de Inventario</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-btn
              :loading="loading"
              :disabled="loading"
              color="green"
              class="ma-2 white--text"
              @click="loader = 'loading'"
            >
              Cargar
              <v-icon right dark> mdi-cloud-upload </v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field
              class="text-xs-center"
              v-model="sku"
              append-icon="mdi-barcode"
              label="Paquete"
              single-line
              hide-details
              v-on:keyup="validateKeyPressed"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-chip class="ma-2" color="green" outlined>
              Ubicación :
              <b>{{ location }}</b>
            </v-chip>
          </v-toolbar>
        </template>
        <template v-slot:item.options="{ item }">
          <v-icon size="sm" color="red" class="mr-1" @click="deleteItem(item)"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  components: {},
  data: () => ({
    headers: [
      { text: "Tracking", sortable: true, value: "sku" },
      { text: "Ubicación", sortable: true, value: "location" },
      { text: "Opciones", value: "options", sortable: false },
    ],
    items: [],
    sku: "",
    location: "",
    loader: null,
    loading: false,
  }),
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 3000);

      this.loader = null;
    },
  },
  mounted() {},

  methods: {
    // displayNotification(type, message) {
    //   this.$swal.fire({
    //     position: "top-end",
    //     type: type,
    //     title: message,
    //     showConfirmButton: false,
    //     timer: 1000,
    //   });
    // },
    validateKeyPressed(e) {
      if (e.keyCode === 13) {
        this.addSku();
      }
    },

    addSku() {
      let firstLetter = this.sku.charAt(0);

      if (
        this.items.length == 0 &&
        firstLetter != "." &&
        this.location === ""
      ) {
        alert("Específique ubicación");
        //this.displayNotification("error", "Especifique Ubicación.");
        this.cleanSku();
        return;
      }

      if (this.items.length == 0 && firstLetter === ".") {
        this.location = this.sku;
        this.cleanSku();
        return;
      }

      if (this.items.length > 0 && firstLetter === ".") {
        this.location = this.sku;
        this.cleanSku();
        return;
      }

      this.items.push({ sku: this.sku, location: this.location });
      this.cleanSku();
    },

    cleanSku() {
      this.sku = "";
    },
  },
};
</script>
