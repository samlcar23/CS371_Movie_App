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
              <div :key="index" class="card--content my-0">
                <img height="350px" :src="movie.poster">
              </div>
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
              <div :key="index" class="card--content my-0">
                <img height="350px" :src="movie.poster" @click="movieDetails(movie)">
              </div>
            </template>
          </section>
        </v-flex>
      </v-layout>
      <MoviePopup :movie="selectedMovie"></MoviePopup>
    </v-container>
  </div>
  <div v-else>
    <h2 class="movieDescriptionHeader">Please login to see account information</h2>
  </div>
</template>

<script>
import MoviePopup from "../components/MoviePopup.vue";

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