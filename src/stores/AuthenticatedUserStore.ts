import AuthenticatedUserState from "@/types/authentication/AuthenticatedUser";
import { defineStore } from "pinia";

export const useAuthenticatedUserStore = defineStore("authenticatedUserStore", {
  state: (): AuthenticatedUserState => ({
    id: null,
    name: "",
    email: "",
  }),
  getters: {},
  actions: {
    async setAuthenticatedUser(user: AuthenticatedUserState) {
      this.id = user.id;
      this.name = user.name;
      this.email = user.email;
    },
  },
});
