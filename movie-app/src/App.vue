<template>
  <v-app>
    <div id="app">
      <div id="nav">
        <v-toolbar app>
          <!-- <v-toolbar-side-icon
        v-if="$root.loggedIn"
        class="hidden-md-and-up"
        @click.end="drawerToggle()"
          ></v-toolbar-side-icon>-->

          <v-toolbar-title class="headline text-uppercase">
            <span class="noBackground" @click="$router.push({ path: `/` })">PremierRent</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn v-if="!$root.loggedIn" @click="loginApp" color="primary" flat large class="mr-2">
            <v-avatar size="35px">
              Log In
              <v-icon right size="30px" color="#1176c4">fas fa-user</v-icon>
            </v-avatar>
          </v-btn>
          <v-menu xs12 v-if="$root.loggedIn">
            <v-btn slot="activator" color="primary" flat large class="mr-2">
              <template v-if="$vuetify.breakpoint.mdAndUp">Hi, {{$root.user.displayName}}</template>
              <v-avatar size="35px">
                <v-icon
                  v-if="$root.user.photoURL == null"
                  :right="$vuetify.breakpoint.mdAndUp"
                  size="30px"
                  color="#1176c4"
                >fas fa-user</v-icon>
                <v-img class="ml-4" right v-else :src="$root.user.photoURL"></v-img>
              </v-avatar>
            </v-btn>
            <v-list>
              <v-list-tile>
                <v-list-tile-action>
                  <v-btn flat @click="$router.push({ path: `/account` })">
                    <span class="navButtons">My Account</span>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-action>
                  <v-btn flat>
                    <span class="navButtons" @click="logout">Log Out</span>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar>
      </div>
      <v-content>
        <router-view/>
        <br>
        <v-img position="right center" height="50" contain :src="attributionLogo"></v-img>
        <span
          class="attrib"
        >This product uses the TMDb API but is not endorsed or certified by TMDb.</span>
        <br>
      </v-content>

      <!-- footer -->
      <v-footer class="text-md-center">
        <v-spacer></v-spacer>
        <span class="body-1">&nbsp;Copyright&nbsp;</span>
        <div>&copy; {{ new Date().getFullYear() }}&nbsp;</div>
        <span class="body-1">&nbsp;|&nbsp;</span>
        <span class="body-1">PremierRent.&nbsp;</span>
        <span class="body-1">All Rights Reserved.</span>
        <v-spacer></v-spacer>
      </v-footer>
    </div>
  </v-app>
</template>

<script>
import { login, addUser, classifyRentals, db } from "./config/db";
import firebase from "firebase";
import logo from "./assets/attributionLogo.png";

export default {
  name: "App",
  data: () => ({
    timer: null,
    attributionLogo: logo
  }),

  watch: {},

  computed: {},

  created: function() {
    this.timer = setInterval(this.fetchMovieClassification, 300000);
  },

  beforeDestroy() {
    clearInterval(this.timer);
  },

  mounted() {
    if (sessionStorage.user) {
      if (sessionStorage.user != null) {
        this.$root.user = JSON.parse(sessionStorage.user);
        this.$root.loggedIn = true;
        var classify = classifyRentals(this.$root.user.uid);
        this.$root.activeRentals = classify[0];
        this.$root.pastRentals = classify[1];
        var rentedRef = db
          .ref()
          .child("users/" + this.$root.user.uid + "/rentals");
        var childListener = rentedRef.on("child_added", snapshot => {
          if (this.$root.user != null) {
            var classify = classifyRentals(this.$root.user.uid);
            this.$root.activeRentals = classify[0];
            this.$root.pastRentals = classify[1];
          }
        });
        var childListener = rentedRef.on("child_removed", snapshot => {
          if (this.$root.user != null) {
            var classify = classifyRentals(this.$root.user.uid);
            this.$root.activeRentals = classify[0];
            this.$root.pastRentals = classify[1];
          }
        });
        var childListener = rentedRef.on("child_changed", snapshot => {
          if (this.$root.user != null) {
            var classify = classifyRentals(this.$root.user.uid);
            this.$root.activeRentals = classify[0];
            this.$root.pastRentals = classify[1];
          }
        });
      }
    } else {
      firebase
        .auth()
        .getRedirectResult()
        .then(result => this.setLogin(result));
    }
  },

  computed: {},

  methods: {
    loginApp() {
      login();
    },

    fetchMovieClassification() {
      if (this.$root.user != null) {
        var classify = classifyRentals(this.$root.user.uid);
        this.$root.activeRentals = classify[0];
        this.$root.pastRentals = classify[1];
      }
    },

    setLogin(result) {
      if (result.user != null) {
        this.$root.user = result.user;
        sessionStorage.user = JSON.stringify(result.user);
        this.$root.loggedIn = true;
        if (result.additionalUserInfo.isNewUser) addUser(result.user);
        else {
          var classify = classifyRentals(result.user.uid);
          this.$root.activeRentals = classify[0];
          this.$root.pastRentals = classify[1];
          var rentedRef = db
            .ref()
            .child("users/" + this.$root.user.uid + "/rentals");
          var childListener = rentedRef.on("child_added", snapshot => {
            if (this.$root.user != null) {
              var classify = classifyRentals(this.$root.user.uid);
              this.$root.activeRentals = classify[0];
              this.$root.pastRentals = classify[1];
            }
          });
          var childListener = rentedRef.on("child_removed", snapshot => {
            if (this.$root.user != null) {
              var classify = classifyRentals(this.$root.user.uid);
              this.$root.activeRentals = classify[0];
              this.$root.pastRentals = classify[1];
            }
          });
          var childListener = rentedRef.on("child_changed", snapshot => {
            if (this.$root.user != null) {
              var classify = classifyRentals(this.$root.user.uid);
              this.$root.activeRentals = classify[0];
              this.$root.pastRentals = classify[1];
            }
          });
        }
      }
    },

    logout() {
      firebase
        .auth()
        .signOut()
        .then(result => this.finalizeLogout(result));
    },

    finalizeLogout(error) {
      if (error != undefined) console.log(result);
      else {
        this.$root.user = null;
        this.$root.activeRentals = [];
        this.$root.pastRentals = [];
        this.$root.loggedIn = false;
        sessionStorage.removeItem("user");
      }
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.attrib {
  float: right;
  font-size: 8px;
}
</style>
