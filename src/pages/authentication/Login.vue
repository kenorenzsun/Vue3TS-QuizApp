<template>
  <div>
    <p class="text-h5 text-center text-white mt-2 mb-0">Welcome !</p>
    <v-form class="mt-5">
      <v-text-field
        v-model="form.email"
        label="Email"
        name="email"
        class="text-white"
        prepend-inner-icon="mdi-account"
        type="text"
        filled
      ></v-text-field>

      <v-text-field
        v-model="form.password"
        id="password"
        label="Password"
        name="password"
        class="text-white"
        prepend-inner-icon="mdi-lock"
        :type="showPass ? 'text' : 'password'"
        :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showPass = !showPass"
        filled
      ></v-text-field>
    </v-form>
    <v-btn
      color="secondary"
      block
      elevation="4"
      rounded-sm
      large
      @click="loginUser()"
      >Login</v-btn
    >
    <p class="text-white mt-2 text-center">
      Not registered yet ?
      <a
        class="redirect-register"
        @click="$router.push('/authentication/register')"
        >Register here</a
      >
    </p>
  </div>
</template>

<script lang="ts">
import LoginPayload from "@/types/authentication/LoginPayload";
import { useMutation } from "@vue/apollo-composable";
import LOGIN from "@/graphql_api/mutations/login.ts";
import { ref } from "vue";
import { defineComponent } from "vue";
import { setUserToken } from "@/helpers/localStorageHelper";
export default defineComponent({
  setup() {
    const { mutate: login, onDone } = useMutation(LOGIN);

    const form = ref<LoginPayload>({
      email: "admin@gmail.com",
      password: "password",
    });
    const showPass = ref<boolean>(false);

    const loginUser = () => {
      login({
        email: form.value.email,
        password: form.value.password,
      });

      onDone(({ data }) => {
        setUserToken(data.login.accessToken.split("|")[1]).then(() => {
          window.location.href = "/";
        });
      });
    };

    return { form, showPass, loginUser };
  },
});
</script>

<style scoped lang="scss">
.redirect-register {
  cursor: pointer;
  font-weight: 700;
  color: white;

  &:hover {
    color: rgb(var(--v-theme-secondary));
  }
}
</style>
