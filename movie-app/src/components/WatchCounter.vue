<template>
  <v-chip color="primary" text-color="white">
    {{currentViews}}
    <v-icon right>theaters</v-icon>
  </v-chip>
</template>

<script>

import { db } from "../config/db.js";

export default {
  props: ["movieId"],
  mounted() {
    if (this.currentViews === 0) {
      this.setupViews(this.movieId);
    }
    this.setupListener(this.movieId);
  },
  data() {
    return {
      currentViews: 0
    }
  },
  methods: {
    setupViews(id) {
      //gets views from firebase
      //sets a new view counter if one doesn't exist
      var ref = db.ref("views/" + id);
      ref.once("value", (snapshot) => {
        var newPost = snapshot.val();
        if(newPost != null){
          this.currentViews = newPost.count;
        } else {
          //Movie is not in firebase
          //Create one and set views to 0
          ref.child("count").set(0);
        }
      });
    },
    setupListener(id) {
      //gets view count changes from firebase
      var ref = db.ref("views").child(id);
      ref.on("child_changed", (snapshot) => {
        var change = snapshot.val();
        this.currentViews = change;
      });
    }
  }
};
</script>