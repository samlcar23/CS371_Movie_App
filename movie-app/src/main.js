import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
require("./assets/style.css");

Vue.use(Vuetify);

Vue.config.productionTip = false;

new Vue({
  data: {
    movieList: [],
    loggedIn: true
  },
  router,
  render: h => h(App)
}).$mount("#app");
