import { createApp } from "vue";
import { createPinia } from "pinia";
import { DefaultApolloClient } from "@vue/apollo-composable";
import App from "./App.vue";
import vuetify from "./plugins/vuetify.ts";
import router from "./plugins/router.ts";
import apolloClient from "./plugins/apollo-client.ts";

import "./style.css";
import "animate.css";
const pinia = createPinia();

const app = createApp(App)
  .use(pinia)
  .use(vuetify)
  .provide(DefaultApolloClient, apolloClient)
  .use(router);

router.isReady().then(() => {
  app.mount("#app");
});
