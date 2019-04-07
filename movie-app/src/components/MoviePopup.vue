<template>
  <!-- EDITABLE POPUP WINDOW FOR MOVIE DATA -->
  <v-dialog v-model="dialog" persistent max-width="800px">
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
                <v-flex xs12>
                  <h2 class="movieDescriptionHeader">Trailer</h2>
                  <p>
                    <iframe width="420" height="315"
                      :src="`https://www.youtube.com/embed/${trailer.key}`">
                    </iframe>
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
              <v-btn v-if="!$root.loggedIn" @click="$root.loggedIn=true" color="primary" flat>Log In</v-btn>
              <v-btn v-if="$root.loggedIn" :loading="saveLoading" color="primary" flat @click="rent">Rent</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </template>
  </v-dialog>
</template>


<script>

import { db, login, addRent, getRentedMovies } from "../config/db.js";

login();
export default {
  props: ["movie"],
  watch: {
    movie(val) {
      this.activeMovie = val;
      this.dialog = true;
      this.getTrailer(this.activeMovie.id);
    }
  },

  data: () => ({
    dialog: false,
    dialogError: false,
    dialogErrorMsg: "",
    activeMovie: {},
    currentDialogItem: {},
    editableDialog: false,
    usersCalculated: false,
    saveLoading: false,
    trailer: ""
  }),
  methods: {
    getTrailer(id) {
      fetch(
        //bbd53a03bcbbff4022afbfd11ffa06a3
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=bbd53a03bcbbff4022afbfd11ffa06a3&language=en-US`
      )
        .then(r => r.json())
        .then(u => {
          this.trailer = u.results.find(function(element) {
              return (element.type == "Trailer");
          });
        })
    },
    rent() {
      
      //atomically increments the firebase view counter
      var r = db.ref("views/" + this.activeMovie.id).child("count");
      r.transaction(function(currentViews) {
        return currentViews + 1;
      });
      this.addMovie(this.activeMovie.id);
      //TODO: complete rent action ie. Play trailer
      
    },
    addMovie(id) {
      addRent(id);
    }
  }
};
</script>