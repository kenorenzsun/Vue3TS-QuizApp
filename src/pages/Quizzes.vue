<template>
  <div>
    <div class="d-flex">
      <div class="text-h4">Quizzes</div>
      <v-spacer></v-spacer>
      <div class="select-category">
        <v-select
          clearable
          v-model="category_id"
          density="comfortable"
          label="Category"
          :items="categories"
          item-title="name"
          item-value="id"
        ></v-select>
      </div>
    </div>

    <v-card
      variant="outlined"
      v-for="quiz in quizzes"
      :key="quiz.id ?? 1"
      class="mb-2"
    >
      <v-card-item>
        <div>
          <div class="text-h6 mb-1">{{ quiz.name }}</div>
          <div class="text-caption">
            {{ quiz.description }}
          </div>
        </div>
      </v-card-item>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="outlined"> Take </v-btn>
      </v-card-actions>
    </v-card>
    <v-pagination
      v-model="page"
      :length="lastPage"
      rounded="40"
      :total-visible="4"
    ></v-pagination>
  </div>
</template>

<script lang="ts">
import { useQuery } from "@vue/apollo-composable";
import CATEGORIES from "@/graphql_api/queries/categories";
import QUIZZES from "@/graphql_api/queries/quizzes";
import { defineComponent } from "vue";
import { watch } from "vue";
import { ref } from "vue";
import Category from "@/types/Category";
import Quiz from "@/types/Quiz";
import QuizzesQueryRefetch from "@/types/QuizzesQueryRefetch";
import { useSystemStore } from "@/stores/SystemStore";

export default defineComponent({
  setup() {
    const category_id = ref<number | null>(null);
    const categories = ref<Category[]>([]);
    const quizzes = ref<Quiz[]>([]);
    const page = ref<number>(1);
    const lastPage = ref<number>(1);

    const systemStore = useSystemStore();
    systemStore.setLoading(true);

    const categoriesQuery = useQuery(CATEGORIES);
    const quizzesQuery = useQuery<any, QuizzesQueryRefetch>(QUIZZES, {
      page: 1,
      category_id: 0,
    });

    categoriesQuery.onResult((categoriesResult) => {
      categories.value = categoriesResult.data?.allCategories;
    });

    quizzesQuery.onResult((quizzesResult) => {
      quizzes.value = quizzesResult.data?.quizzes.data;
      lastPage.value = quizzesResult.data?.quizzes.paginatorInfo.lastPage;
    });

    const pageChange = () => {
      quizzesQuery.refetch({
        category_id: category_id.value,
        page: page.value,
      });
    };

    watch(category_id, (value) => {
      quizzesQuery.refetch(
        value
          ? { category_id: value, page: page.value }
          : { category_id: 0, page: page.value }
      );
    });

    watch(page, () => {
      pageChange();
    });

    return {
      category_id,
      page,
      lastPage,
      quizzes,
      categories,
    };
  },
});
</script>

<style scoped>
.select-category {
  width: 200px;
}
</style>
