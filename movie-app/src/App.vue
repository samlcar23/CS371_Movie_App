<template>
  <v-app>
    <div id="app">
      <div id="nav">
        <v-toolbar app>
          <!-- <v-toolbar-side-icon
        v-if="$root.loggedIn"
        class="hidden-md-and-up"
        @click.end="drawerToggle()"
          ></v-toolbar-side-icon>-->

          <v-toolbar-title class="headline text-uppercase">
            <span class="noBackground">PremierRent</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>

          <v-menu s3>
            <v-btn slot="activator" color="primary" flat icon large class="mr-2">
              <v-avatar size="35px">
                <v-icon round size="30px" color="#1176c4">fas fa-user</v-icon>
              </v-avatar>
            </v-btn>
            <v-list>
              <v-list-tile class="hidden-md-and-up">
                <v-list-tile-action-text>
                  <v-autocomplete
                    color="#1176c4"
                    :items="tags"
                    label="Search Here!"
                    @click="getTags()"
                    v-if="this.$root.loggedIn"
                    v-on:keyup.enter="switchToSearch"
                    v-model="$root.searchVal"
                  ></v-autocomplete>
                </v-list-tile-action-text>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-action>
                  <v-btn flat>
                    <span class="navButtons">My Account</span>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-action>
                  <v-btn flat>
                    <span class="navButtons">Log Out</span>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar>
      </div>
      <v-content>
        <router-view/>
      </v-content>
    </div>
  </v-app>
</template>

<style>
</style>
