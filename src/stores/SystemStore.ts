import System from "@/types/authentication/System";
import { defineStore } from "pinia";

export const useSystemStore = defineStore("systemStore", {
  state: (): System => ({
    loading: false,
  }),
  getters: {},
  actions: {
    async setLoading(loading: boolean) {
      this.loading = loading;
    },
  },
});
