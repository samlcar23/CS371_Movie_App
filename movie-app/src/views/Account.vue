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

export default {
  mounted() {
    if (this.$root.movieList.length <= 0) this.getNowPlaying();
  },
  components: {
    MoviePopup
  },
  methods: {
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
    ]
  })
};
</script>

<style>
</style>