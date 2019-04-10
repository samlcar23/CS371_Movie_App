<template>
  <div>
    <v-breadcrumbs class="ml-4" :items="navPath" divider=">"></v-breadcrumbs>
    <v-container fluid grid-list-md class="py-4 mx-0">
      <v-layout align-center justify-center row fill-height>
        <div class="frame">
            <iframe :width="`${window.width - 100}`" :height="`${window.height - 150}`" allowfullscreen="allowfullscreen"
                :src="`https://www.youtube.com/embed/${trailerKey}?autoplay=1`">
            </iframe>
        </div>
    </v-layout>
    </v-container>
  </div>
</template>

<script>

import router from '../router'

export default {
  props: {
      trailerKey: {
          type: String
      }
  },
  data() {
    return {
      key: "",
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
      window.addEventListener('resize', this.handleResize)
      this.handleResize();
  },
  destroyed() {
      window.removeEventListener('resize', this.handleResize)
  },
  methods: {
      handleResize() {
          this.window.width = window.innerWidth;
          this.window.height = window.innerHeight;
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
