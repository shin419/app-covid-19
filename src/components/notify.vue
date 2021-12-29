<template>
  <v-snackbar
      v-model="snackbar.notify"
      timeout="1000"
      color="success"
      outlined
  >
    <v-icon color="success" right>
      mdi-checkbox-marked-circle
    </v-icon> {{ snackbar.val }}
  </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: ['snackbar'],
});
</script>
