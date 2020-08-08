import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
//import VueSweetalert2 from "vue-sweetalert2";
// // If you don't need the styles, do not connect
// import 'sweetalert2/dist/sweetalert2.min.css';

Vue.config.productionTip = false;

//Vue.use(VueSweetalert2);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
