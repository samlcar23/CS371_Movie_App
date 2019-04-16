<template>
  <!-- EDITABLE POPUP WINDOW FOR MOVIE DATA -->
  <v-dialog v-model="dialog" max-width="800px">
    <template>
      <v-alert v-model="dialogError" dismissible type="error">{{dialogErrorMsg}}</v-alert>
      <v-layout row wrap>
        <v-flex xs12 md6>
          <v-card height="100%">
            <div class="text-xs-center py-3">
              <img height="500px" :src="activeMovie.poster">
            </div>
          </v-card>
        </v-flex>
        <v-divider></v-divider>
        <v-flex xs12 md6>
          <v-card height="100%">
            <v-card-title>
              <span class="headline pl-1">{{activeMovie.title}}</span>
            </v-card-title>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <h2 class="movieDescriptionHeader">Description:</h2>
                  <p>{{activeMovie.overview}}</p>
                </v-flex>
                <v-flex xs12>
                  <h2 class="movieDescriptionHeader">Release Date:</h2>
                  <p>{{activeMovie.release_date}}</p>
                </v-flex>
                <v-flex xs12>
                  <h2 class="movieDescriptionHeader">Average Rating:</h2>
                  <p>
                    {{activeMovie.vote_average}}
                    <v-icon right size="18px">star</v-icon>
                  </p>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex sm12>
          <v-card>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="#1176c4" flat @click="dialog=false">Close</v-btn>
              <v-btn v-if="!$root.loggedIn" color="primary" @click="handleLogin" flat>Log In</v-btn>
              <v-btn
                v-if="$root.loggedIn && !$root.activeRentals.includes(activeMovie.id)"
                :loading="saveLoading"
                color="primary"
                flat
                @click="rent"
              >Rent</v-btn>
              <v-btn
                v-if="$root.loggedIn && $root.activeRentals.includes(activeMovie.id)"
                :loading="saveLoading"
                color="primary"
                flat
                @click="watchMovie"
              >Watch</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </template>
    <v-dialog v-model="noCardDialog" max-width="500px">
      <v-card color="grey lighten-2">
        <v-card-title>
          <h2>Unable to rent: {{activeMovie.title}}</h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <p>
            You don't have a valid payment method on file.
            <br>Would you like to add one now?
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" flat @click="goToAccount">Yes</v-btn>
          <v-btn color="secondary" flat @click="noCardDialog=false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>


<script>
import { db, login, addRent, classifyRentals } from "../config/db.js";

export default {
  props: ["movie"],
  watch: {
    movie(val) {
      this.activeMovie = val;
      this.dialog = true;
    }
  },

  data: () => ({
    dialog: false,
    noCardDialog: false,
    dialogError: false,
    dialogErrorMsg: "",
    activeMovie: {},
    currentDialogItem: {},
    editableDialog: false,
    usersCalculated: false,
    saveLoading: false
  }),
  methods: {
    goToAccount() {
      this.$router.push({
        name: "account"
      });
    },

    rent() {
      //Check for payment method
      let paymentRef = db
        .ref()
        .child("users/" + this.$root.user.uid + "/paymentMethod/creditCard/");
      paymentRef.once("value", snapshot => {
        if (snapshot.exists()) {
          //Payment method exists
          //check if not expired
          var date = snapshot.child("date").val();
          var currentDate = new Date().toISOString().substring(0, 10);

          if (date > currentDate) {
            //atomically increments the firebase view counter
            var r = db.ref("views/" + this.activeMovie.id).child("count");
            r.transaction(function(currentViews) {
              return currentViews + 1;
            });

            //Add movie to users rented list
            addRent(this.activeMovie.id, this.$root.user.uid);

            //navigate to the movie
            this.$router.push({
              name: "play",
              params: {
                movieId: this.activeMovie.id.toString()
              }
            });
          } else {
            this.noCardDialog = true;
          }
        } else {
          this.noCardDialog = true;
        }
      });
    },

    watchMovie() {
      this.$router.push({
        name: "play",
        params: {
          movieId: this.activeMovie.id.toString()
        }
      });
    },

    handleLogin() {
      login();
    }
  }
};
</script>