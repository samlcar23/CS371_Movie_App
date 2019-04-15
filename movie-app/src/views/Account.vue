<template>
  <div v-if="$root.loggedIn">
    <v-breadcrumbs class="ml-4" :items="navPath" divider=">"></v-breadcrumbs>
    <v-container fluid grid-list-md class="pt-0 pb-4 mx-0">
      <v-layout row wrap>
        <v-flex xs12>
          <h2 class="movieDescriptionHeader">Active Rentals:</h2>
        </v-flex>
        <v-flex xs12 class="py-0">
          <section class="card">
            <template v-for="(movie,index) in $root.movieList">
              <template v-if="$root.activeRentals.includes(movie.id)">
                <div :key="index" class="card--content my-0">
                  <img height="350px" :src="movie.poster" @click="movieDetails(movie)">
                </div>
              </template>
            </template>
          </section>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 pt-4>
          <h2 class="movieDescriptionHeader">Previous Rentals:</h2>
        </v-flex>
        <v-flex xs12 class="py-0">
          <section class="card">
            <template v-for="(movie,index) in $root.movieList">
              <template v-if="$root.pastRentals.includes(movie.id)">
                <div :key="index" class="card--content my-0">
                  <img height="350px" :src="movie.poster" @click="movieDetails(movie)">
                </div>
              </template>
            </template>
          </section>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
         <v-flex xs12 pt-4>
      <h2 class="movieDescriptionHeader">Payment Options:</h2>
    </v-flex>
      <v-flex xs12 class="py-0">
        <v-form v-model="valid" ref="form">
          <v-container>
            <v-layout>
              <v-flex
                xs12
                md4
              >
                <v-text-field
                  v-model="ccNumber"
                  :rules="ccRules"
                  :counter="16"
                  label="Credit Card Number"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex
                xs12
                md4
              >
                <v-text-field
                  v-model="ccCSV"
                  :rules="ccCSVRules"
                  :counter="3"
                  label="CSV"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex
                xs12
                md4
              >
                <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="ccDate"
                  label="Expiration Date"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                  :rules="ccDateRules"
                  required
                ></v-text-field>
              </template>
              <v-date-picker v-model="ccDate" @input="menu = false"></v-date-picker>
            </v-menu>
              </v-flex>

              <v-flex
                xs12
                md4
              >
              <v-btn @click="submit">Update</v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-flex>
      </v-layout>
      <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      color="success"
     v-if="success == true">
      {{ textSuccess }}
      <v-btn dark flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
     v-else>
      {{ textFail }}
      <v-btn dark flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
      <MoviePopup :movie="selectedMovie"></MoviePopup>
    </v-container>
  </div>
  <div v-else>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <h2
            style="text-align:center"
            class="movieDescriptionHeader pt-2"
          >Please login to see account information</h2>
        </v-flex>
        <v-flex xs12>
          <div class="text-xs-center pt-2">
            <v-btn @click="handleLogin()">Login</v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import MoviePopup from "../components/MoviePopup.vue";
import { login } from "../config/db";

import { updatePayment } from "../config/db.js";

export default {
  mounted() {
    if (this.$root.movieList.length <= 0) this.getNowPlaying();
  },
  components: {
    MoviePopup,
  },
  methods: { 
    submit() {
      if (this.$refs.form.validate()) {
        updatePayment(this.ccNumber, this.ccCSV, this.ccDate, this.$root.user.uid);
        //Push to firebase
        this.success = true;
        this.snackbar = true;
      } else {
        this.success = false;
        this.snackbar = true;
      }
    },
    getNowPlaying() {
      fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=bbd53a03bcbbff4022afbfd11ffa06a3&language=en-US&page=1`
      )
        .then(r => r.json())
        .then(u => {
          this.nowPlaying = u.results;
        })
        .then(p => {
          this.nowPlaying.forEach(element => {
            this.getImages(element);
          });
        });
    },
    getImages(obj) {
      this.$root.movieList = [];
      fetch(`https://image.tmdb.org/t/p/w500${obj.poster_path}`).then(r => {
        this.$root.movieList.push({
          ...obj,
          poster: r.url
        });
      });
    },
    movieDetails(movie) {
      this.selectedMovie = { ...movie };
    },

    handleLogin() {
      login();
    }
  },
  data: () => ({
    selectedMovie: {},
    nowPlaying: [],
    success: false,
    snackbar: false,
    textSuccess: "Updated Succesfully",
    textFail: "Failed to Update",
    ccName: "",
    ccCSV: "",
    ccNumber: "",
    ccDate: "",
    navPath: [
      {
        text: "Home",
        disabled: false,
        to: "/"
      },
      {
        text: "My Account",
        disabled: true,
        to: "/account"
      }
    ],
    valid: false,
      ccRules: [
        v => !!v || 'Credit Card Number is required',
        v => v.length == 16 || 'Credit Card Number must be 16 digits'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      ccCSVRules: [
        v => !!v || 'CSV is required',
        v => v.length == 3 || 'CSV must be 3 digits'
      ],
      menu: false,
      ccDateRules: [
        v => !!v || 'Expiration Date is required',
        v => v.length == 10 || 'Expiration Date is not valid'
      ]
  })
};
</script>

<style>
</style>