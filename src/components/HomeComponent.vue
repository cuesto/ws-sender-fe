<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table :headers="headers" :items="items" sort-by="location" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Conteo de Inventario</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
              class="text-xs-center"
              v-model="sku"
              append-icon="mdi-barcode"
              label="Paquete"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-btn style="margin-right: 10px" @click="addSku" color="blue" dark>
              <v-icon left dark>mdi-barcode</v-icon>Cargar
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:item.options="{ item }">
          <v-icon
            size="sm"
            variant="outline-info"
            color="blue"
            class="mr-1"
            @click="editItem(item)"
          >mdi-pencil</v-icon>
          <v-icon size="sm" color="red" class="mr-1" @click="deleteItem(item)">mdi-delete</v-icon>
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
  }),
  mounted() {},

  methods: {
    addSku() {
      let firstLetter = this.sku.charAt(0);

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
      console.table(this.items);
    },

    cleanSku() {
      this.sku = "";
    },
  },
};
</script>
