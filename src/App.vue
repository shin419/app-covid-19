<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios'
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyBwAzZGU1ZvxyhmpatroecdshIOSUaQ8N8",
  authDomain: "app-covid-19-43ffb.firebaseapp.com",
  projectId: "app-covid-19-43ffb",
  storageBucket: "app-covid-19-43ffb.appspot.com",
  messagingSenderId: "1016931497598",
  appId: "1:1016931497598:web:6a733ce8bd3a6e77aa4a2f",
  measurementId: "G-10QVS0TMC7"
};
initializeApp(firebaseConfig)
export default Vue.extend({
  name: 'App',

  data: () => ({
  }),
  methods: {
    getData() {
      axios.get('https://restcountries.com/v3.1/all')
          .then((res) => {
            if (res.status === 200) {
              let countries = res.data || []
              this.$store.dispatch('setCountries', countries)
            }
          })
          .catch((e) => {
            console.log(e)
          })
    }
  },
  created() {
    // this.getData()
  }
});
</script>
