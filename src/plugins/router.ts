import { createRouter, createWebHistory } from "vue-router";
import Main from "@/template/Main.vue";
import NotFound from "@/template/NotFound.vue";
import Authentication from "@/template/Authentication.vue";

import { useAuthenticatedUserStore } from "@/stores/AuthenticatedUserStore";
import { provideApolloClient, useApolloClient } from "@vue/apollo-composable";
import apolloClient from "@/plugins/apollo-client.ts";
import AUTHENTICATED_USER from "@/graphql_api/queries/authenticated_user";

provideApolloClient(apolloClient);

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: "users",
        path: "users",
        component: () => import("@/pages/Users.vue"),
      },
      {
        name: "quizzes",
        path: "quizzes",
        component: () => import("@/pages/Quizzes.vue"),
      },
      {
        name: "categories",
        path: "categories",
        component: () => import("@/pages/Categories.vue"),
      },
      {
        name: "category",
        path: "category/:id",
        component: () => import("@/pages/Category.vue"),
      },
      {
        name: "category_quiz",
        path: "category/:id/quiz/:quiz_id",
        component: () => import("@/pages/Category/Quiz.vue"),
      },
      {
        name: "category_quiz_question",
        path: "category/:id/quiz/:quiz_id/question/:question_id",
        component: () => import("@/pages/Category/Quiz/Question.vue"),
      },
    ],
  },
  {
    path: "/authentication/",
    name: "authentication",
    component: () => Authentication,
    meta: {
      requiresAuth: false,
    },
    children: [
      {
        name: "login",
        path: "login",
        component: () => import("@/pages/authentication/Login.vue"),
      },
      {
        name: "register",
        path: "register",
        component: () => import("@/pages/authentication/Registration.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFound,
    meta: {
      requiresAuth: false,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  localStorage.setItem("from", from.fullPath);
  const { resolveClient } = useApolloClient();
  const authenticatedUserStore = useAuthenticatedUserStore();
  const client = resolveClient();

  const { data } = await client.query({ query: AUTHENTICATED_USER });

  if (data.me) {
    authenticatedUserStore.setAuthenticatedUser(data.me);
  }
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (!requiresAuth && data.me?.id) {
    next("/");
  } else if (requiresAuth && !data.me?.id) {
    next("/authentication/login");
  } else {
    next();
  }
});

export default router;
