<script lang="ts">
import ConfirmDialog from "./components/ConfirmDialog.vue";
export default {
  components: {
    ConfirmDialog,
  },
};
</script>

<template>
  <div class="container">
    <ConfirmDialog>
      <router-view></router-view>
    </ConfirmDialog>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
