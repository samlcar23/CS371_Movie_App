<template>
  <div>
    <v-container fluid grid-list-md class="py-4 mx-0">
      <v-layout row wrap justify-center>
        <template v-for="(movie, index) in nowPlayingMovies">
          <v-flex :key="index" xs11 sm5 md2 lg2 xl2>
            <v-card dark color="primary">
              <v-img :src="movie.poster"></v-img>
              <v-card-text>{{movie.title}} <WatchCounter></WatchCounter></v-card-text>
            </v-card>
          </v-flex>
        </template>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import WatchCounter from '../components/WatchCounter.vue';
export default {
  mounted() {
    this.getNowPlaying();
  },
  components:{
    WatchCounter
  },
  data() {
    return {
      nowPlaying: [],
      nowPlayingMovies: []
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
      //console.log(key + " -- " + path);
      fetch(`https://image.tmdb.org/t/p/w500${obj.poster_path}`).then(r => {
        this.nowPlayingMovies.push({
          title: obj.title,
          overview: obj.overview,
          poster: r.url
        });
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
