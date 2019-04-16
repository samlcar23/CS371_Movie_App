<template>
  <div>
    <v-breadcrumbs class="ml-4" :items="navPath" divider=">"></v-breadcrumbs>
    <v-container fluid grid-list-md class="py-4 mx-0">
      <v-layout align-center justify-center row fill-height>
        <template v-if="$root.activeRentals.includes(parseInt(movieId))">
          <template v-if="trailer!=null">
            <div class="frame">
              <iframe
                allow="autoplay"
                :width="`${window.width - 100}`"
                :height="`${window.height - 150}`"
                allowfullscreen="allowfullscreen"
                :src="`https://www.youtube.com/embed/${trailer.key}?autoplay=1`"
              ></iframe>
            </div>
          </template>
        </template>

        <template v-else>
          <v-container text-xs-center>
            <h2>You are not authorized to view this title.</h2>
          </v-container>
        </template>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import router from "../router";

export default {
  props: {
    movieId: {
      type: String
    }
  },

  data() {
    return {
      key: "",
      trailer: null,
      navPath: [
        {
          text: "Home",
          disabled: false,
          to: "/"
        },
        {
          text: "Play",
          disabled: true,
          to: "/play"
        }
      ],
      window: {
        width: 0,
        height: 0
      }
    };
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },

  mounted() {
    this.getTrailer(this.movieId);
  },

  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    },

    getTrailer(id) {
      fetch(
        //bbd53a03bcbbff4022afbfd11ffa06a3
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=bbd53a03bcbbff4022afbfd11ffa06a3&language=en-US`
      )
        .then(r => r.json())
        .then(u => {
          this.trailer = u.results.find(function(element) {
            return element.type == "Trailer";
          });
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.frame {
  padding: 0px 10px 10px 10px;
}
</style>
