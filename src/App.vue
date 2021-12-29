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
  apiKey: "AIzaSyCx82osJyixoyb1K7uFuOZSRpZDRWyhE_0",
  authDomain: "covid-19-365b8.firebaseapp.com",
  projectId: "covid-19-365b8",
  storageBucket: "covid-19-365b8.appspot.com",
  messagingSenderId: "858317621349",
  appId: "1:858317621349:web:b1d508cf94dcebfcc49e8c",
  measurementId: "G-GHCT52X50E"
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
    this.getData()
  }
});
</script>
