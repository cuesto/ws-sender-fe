<template>
  <v-layout>
    <!-- HERE -->
    <iframe id="ifrm" :src="url" width="500" height="500"></iframe>
  </v-layout>
</template>
<script>
export default {
  components: {},
  data: () => ({
    url: null,
  }),
  watch: {},
  mounted() {},
  created() {
    if (this.$store.state.userProfile) {
      this.url = this.$store.state.userProfile.server;
    }
  },
  methods: {},
};
</script>
