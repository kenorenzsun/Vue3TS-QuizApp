<template>
  <div>
    <v-app id="inspire" class="at-authentication">
      <v-main>
        <v-container class="fill-height" fluid>
          <v-row justify="center" align="center">
            <v-card elevation="2" class="at-authentication-form">
              <v-card-text>
                <v-row>
                  <v-col cols="6" align-self="center">
                    <v-img max-height="500" cover :src="Logo"></v-img>
                  </v-col>
                  <v-col cols="6">
                    <router-view v-slot="{ Component }">
                      <transition
                        enter-active-class="animate__animated animate__backInUp"
                        leave-active-class="animate__animated animate__backOutDown"
                        mode="out-in"
                      >
                        <component :is="Component" />
                      </transition>
                    </router-view>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script setup lang="ts">
import Logo from "@/assets/quiz_vector.jpg";
</script>

<style scoped>
.fill-height {
  min-height: 100%;
  height: auto !important;
  /* cross-browser */
  height: 100%;
  /* cross-browser */
}

.image-login {
  width: 100%;
  height: 100vh;
}

.at-welcome {
  font-weight: bolder;
  color: #545454;
}

.at-authentication-form {
  width: 50%;
  background-color: rgb(var(--v-theme-primary));
  backdrop-filter: blur(10px);
}

.at-authentication {
  background-color: rgb(var(--v-theme-secondary));
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
