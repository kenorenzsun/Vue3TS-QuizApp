<template>
  <div>
    <v-sheet rounded="lg" class="pa-2">
      <p class="text-h6 text-center">High Scorers</p>
      <v-list rounded="lg">
        <v-list-item v-for="n in 5" :key="n" link>
          <v-list-item-title> List Item {{ n }} </v-list-item-title>
        </v-list-item>

        <v-divider class="my-2"></v-divider>

        <v-list-item link color="grey-lighten-4">
          <v-list-item-title> Refresh </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
