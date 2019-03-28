<template>
  <div>
    <h1>Hello World</h1>
    <v-btn small  v-on:click="getNowPlaying">Now Playing</v-btn> 
    <!-- <br>for debug: {{nowPlayingMovies}}<br> -->

    <template>
      <v-container grid-list-xl>
        <v-layout align-enter justify-center row wrap>
          <template v-for="(movie, index) in nowPlayingMovies">
            <v-flex>
              <v-card dark color="primary" width="200" height="350">
                <v-img :src="movie.poster"></v-img>
                <v-card-text>{{movie.title}}</v-card-text>
              </v-card>
            </v-flex>
          </template>
        </v-layout>
      </v-container>
    </template>

  </div>
  
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      nowPlaying: [],
      nowPlayingMovies: []
    }
  },
  methods: {
    getNowPlaying() {
      fetch (`https://api.themoviedb.org/3/movie/now_playing?api_key=bbd53a03bcbbff4022afbfd11ffa06a3&language=en-US&page=1`)
        .then(r => r.json())
        .then(u => {
          this.nowPlaying = u.results;
        }).then(p => {
          this.nowPlaying.forEach(element => {
            this.getImages(element);
          });
        });
    }, 
    getImages(obj) {
        //console.log(key + " -- " + path);
        fetch(`https://image.tmdb.org/t/p/w500${obj.poster_path}`)
        .then(r => {
          this.nowPlayingMovies.push({
            title: obj.title,
            overview: obj.overview,
            poster: r.url
          });
        });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
