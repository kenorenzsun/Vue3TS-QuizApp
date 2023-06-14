<template>
  <div>
    <v-app-bar flat color="primary">
      <v-container class="fill-height d-flex align-center">
        <v-avatar class="me-10 ms-4" color="grey-darken-1" size="40" src="">
          <v-img src="/vite.svg" alt="John"></v-img>
        </v-avatar>

        <v-btn
          v-for="link in links"
          :key="link.name"
          @click="goTo(link.path)"
          variant="text"
        >
          {{ link.name }}
        </v-btn>

        <v-spacer></v-spacer>
        <v-btn @click="logoutUser">
          <v-icon icon="mdi-logout-variant"></v-icon>
        </v-btn>
      </v-container>
    </v-app-bar>
  </div>
</template>

<script lang="ts">
import LOGOUT from "@/graphql_api/mutations/logout";
import { setUserToken } from "@/helpers/localStorageHelper";
import { useMutation } from "@vue/apollo-composable";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const { mutate: logout, onDone } = useMutation(LOGOUT);
    const router = useRouter();

    const links: {
      name: string;
      path: string;
      for_admin_only: boolean;
    }[] = [
      { name: "Take a Quiz", path: "/quizzes", for_admin_only: false },
      { name: "Users", path: "/users", for_admin_only: true },
      { name: "Categories", path: "/categories", for_admin_only: true },
    ];

    const goTo = (path: string) => {
      router.push(path);
    };

    const logoutUser = () => {
      logout();

      onDone(() => {
        setUserToken("").then(() => {
          window.location.href = "/authentication/login";
        });
      });
    };

    return { goTo, links, logoutUser };
  },
});
</script>

<style scoped></style>
