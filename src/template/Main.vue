<template>
  <v-app id="inspire">
    <AppBar></AppBar>
    <v-overlay :opacity="1" :model-value="loading">
      <v-progress-circular indeterminate size="64">
        Loading...
      </v-progress-circular>
    </v-overlay>
    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-row>
          <v-col cols="2">
            <SideBar></SideBar>
          </v-col>

          <v-col>
            <v-sheet min-height="80svh" class="pa-5" rounded="lg">
              <router-view v-slot="{ Component }">
                <transition
                  enter-active-class="animate__animated animate__backInRight"
                  leave-active-class="animate__animated animate__backOutRight"
                  mode="out-in"
                >
                  <component :is="Component" />
                </transition>
              </router-view>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
      <confirm ref="veeConfirmRef"></confirm>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import AppBar from "@/layouts/AppBar.vue";
import SideBar from "@/layouts/SideBar.vue";
import Confirm from "@/components/ConfirmDialog.vue";
import { useSystemStore } from "@/stores/SystemStore";

export default defineComponent({
  components: {
    AppBar,
    SideBar,
    Confirm,
  },
  setup() {
    const veeConfirmRef = ref<InstanceType<typeof Confirm>>();

    const links = ["Dashboard", "Messages", "Profile", "Updates"];
    const { loading } = useSystemStore();

    return { links, loading, veeConfirmRef };
  },
});
</script>

<style scoped></style>
