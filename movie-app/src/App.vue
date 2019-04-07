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
            <span class="noBackground" @click="$router.push({ path: `/` })">PremierRent</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn
            v-if="!$root.loggedIn"
            @click="$root.loggedIn=true"
            color="primary"
            flat
            large
            class="mr-2"
          >
            <v-avatar size="35px">
              Log In
              <v-icon right size="30px" color="#1176c4">fas fa-user</v-icon>
            </v-avatar>
          </v-btn>
          <v-menu s3 v-if="$root.loggedIn">
            <v-btn slot="activator" color="primary" flat icon large class="mr-2">
              <v-avatar size="35px">
                <v-icon round size="30px" color="#1176c4">fas fa-user</v-icon>
              </v-avatar>
            </v-btn>
            <v-list>
              <v-list-tile>
                <v-list-tile-action>
                  <v-btn flat>
                    <span class="navButtons" @click="$router.push({ path: `/account` })">My Account</span>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-action>
                  <v-btn flat>
                    <span class="navButtons" @click="$root.loggedIn=false">Log Out</span>
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

      <!-- footer -->
      <v-footer class="text-md-center">
        <v-spacer></v-spacer>
        <span class="body-1">&nbsp;Copyright&nbsp;</span>
        <div>&copy; {{ new Date().getFullYear() }}&nbsp;</div>
        <span class="body-1">&nbsp;|&nbsp;</span>
        <span class="body-1">PremierRent.&nbsp;</span>
        <span class="body-1">All Rights Reserved.</span>
        <v-spacer></v-spacer>
      </v-footer>
    </div>
  </v-app>
</template>

<style>
</style>
