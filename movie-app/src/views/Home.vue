<template>
  <div>
    <v-breadcrumbs class="ml-4" :items="navPath" divider=">"></v-breadcrumbs>
    <v-container fluid grid-list-md class="py-4 mx-0">
      <v-layout row wrap justify-center>
        <!-- <p>{{nowPlayingMovies[0]}}</p> -->
        <template v-for="(movie, index) in $root.movieList">
          <v-flex :key="index" xs11 sm5 md2 lg2 xl2>
            <v-card height="100%" dark color="primary" @click="movieDetails(movie)">
              <v-img :src="movie.poster"></v-img>
              <v-card-text>
                {{movie.title}}
                <WatchCounter :movieId="movie.id"></WatchCounter>
              </v-card-text>
            </v-card>
          </v-flex>
        </template>
      </v-layout>
      <v-layout row wrap justify-center>
        <v-flex>
          <MoviePopup :movie="selectedMovie"></MoviePopup>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>

import WatchCounter from "../components/WatchCounter.vue";
import MoviePopup from "../components/MoviePopup.vue";


export default {
  mounted() {
    if (this.$root.movieList.length <= 0) this.getNowPlaying();
  },
  components: {
    WatchCounter,
    MoviePopup
  },
  data() {
    return {
      nowPlaying: [],
      selectedMovie: {},
      navPath: [
      {
        text: "Home",
        disabled: true,
        to: "/"
      }
    ]
    };
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

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
