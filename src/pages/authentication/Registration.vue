<template>
  <div>
    <p class="text-h5 text-center text-white mt-2 mb-0">Registration</p>
    <v-form class="mt-5">
      <v-text-field
        v-model="form.email"
        label="Email"
        name="email"
        class="text-white"
        density="comfortable"
        prepend-inner-icon="mdi-account"
        type="text"
        filled
      ></v-text-field>
      <v-text-field
        v-model="form.name"
        label="Name"
        name="name"
        class="text-white"
        density="comfortable"
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
        density="comfortable"
        prepend-inner-icon="mdi-lock"
        :type="showPass ? 'text' : 'password'"
        :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showPass = !showPass"
        filled
      ></v-text-field>
      <v-text-field
        v-model="form.password_confirmation"
        id="password"
        label="Confirm Password"
        name="password"
        class="text-white"
        density="comfortable"
        prepend-inner-icon="mdi-lock"
        :type="showConfirmPass ? 'text' : 'password'"
        :append-inner-icon="showConfirmPass ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showConfirmPass = !showConfirmPass"
        filled
      ></v-text-field>
    </v-form>
    <v-btn
      color="secondary"
      block
      elevation="4"
      rounded-sm
      large
      @click="registerUser()"
      >Register</v-btn
    >
  </div>
</template>
<script lang="ts">
import RegistrationPayload from "@/types/authentication/RegistrationPayload";
import REGISTER from "@/graphql_api/mutations/register.ts";
import { ref } from "vue";
import { defineComponent } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const router = useRouter();
    const { mutate: register, onDone } = useMutation(REGISTER);

    const form = ref<RegistrationPayload>({
      email: "",
      name: "",
      password: "",
      password_confirmation: "",
    });

    const showPass = ref<boolean>(false);
    const showConfirmPass = ref<boolean>(false);

    const registerUser = () => {
      register({
        email: form.value.email,
        password: form.value.password,
        name: form.value.name,
        password_confirmation: form.value.password_confirmation,
      });

      onDone(() => {
        router.push("/authentication/login");
      });
    };

    return { form, showPass, showConfirmPass, registerUser };
  },
});
</script>

<style scoped></style>
