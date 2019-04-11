import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Vuetify from "vuetify";
import VueFire from 'vuefire'
import "vuetify/dist/vuetify.min.css";
require("./assets/style.css");

Vue.use(VueFire);
Vue.use(Vuetify);

Vue.config.productionTip = false;

new Vue({
  data: {
    movieList: [],
    loggedIn: false,
    user: null,
    activeRentals: [],
    pastRentals: []
  },
  router,
  render: h => h(App)
}).$mount("#app");
