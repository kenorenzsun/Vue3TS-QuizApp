<template>
  <div>
    <div class="d-flex mb-2">
      <v-spacer></v-spacer>
      <v-btn @click="$router.push(`/categories`)">Go Back</v-btn>
    </div>
    <div class="d-flex">
      <div class="text-h5">Category : {{ category.name }}</div>
      <v-spacer></v-spacer>
      <v-btn density="comfortable" @click="addQuiz">Add QUIZ</v-btn>
      <v-spacer></v-spacer>

      <v-text-field
        v-model="quizTableOptions.search"
        hide-details
        placeholder="Search name..."
        density="compact"
        prepend-inner-icon="mdi-magnify"
      ></v-text-field>
    </div>
    <div class="text-subtitle-1 mb-3">{{ category.description }}</div>

    <v-data-table-server
      ref="table"
      v-model:items-per-page="quizTableOptions.itemsPerPage"
      :headers="tableHeaders"
      :items-length="totalQuizzes"
      :items="quizzes"
      :search="quizTableOptions.search"
      :loading="loading"
      class="elevation-1"
      item-value="name"
      @update:options="reloadQuizzes"
    >
      <template v-slot:item.description="{ item }">
        <div class="quizzes-description">{{ item.raw.description }}</div>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          color="primary"
          size="small"
          class="me-2"
          @click="$router.push(`/category/${category.id}/quiz/${item.raw.id}`)"
        >
          mdi-eye
        </v-icon>
        <v-icon
          color="warning"
          size="small"
          class="me-2"
          @click="editQuiz(item.raw)"
        >
          mdi-pencil
        </v-icon>
        <v-icon size="small" color="error" @click="deleteQuiz(item.raw)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table-server>
    <QuizForm
      :form="quiz"
      :dialogState="quizDialog"
      @close="quizDialog = false"
      @save="(quizDialog = false), saveQuiz()"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ref } from "vue";
import ReadOnlyDataTableHeader from "@/types/ReadOnlyDataTableHeader";
import QuizForm from "@/components/Forms/Quiz.vue";
import TableDefaultOptions from "@/types/TableDefaultOptions";
import { useDialog } from "@/composables/useConfirm";
import Quiz from "@/types/Quiz";
import { useRoute } from "vue-router";
import Category from "@/types/Category";
import { useMutation, useQuery } from "@vue/apollo-composable";
import CATEGORY from "@/graphql_api/queries/category";
import QUIZZES from "@/graphql_api/queries/quizzes";
import QuizzesQueryRefetch from "@/types/QuizzesQueryRefetch";
import ADD_QUIZ from "@/graphql_api/mutations/add_quiz";
import UPDATE_QUIZ from "@/graphql_api/mutations/update_quiz";
import DELETE_QUIZ from "@/graphql_api/mutations/delete_quiz";
export default defineComponent({
  components: {
    QuizForm,
  },
  setup() {
    const route = useRoute();
    const createConfirmDialog = useDialog();
    const quizDialog = ref<boolean>(false);

    const category = ref<Category>({
      id: null,
      name: "",
      description: "",
    });

    const categoryQuery = useQuery(CATEGORY, {
      id: route.params.id,
    });

    categoryQuery.onResult((categoryResult) => {
      category.value = categoryResult.data?.category;
    });

    const tableHeaders: ReadOnlyDataTableHeader[] = [
      {
        title: "Name",
        value: "name",
        key: "name",
      },
      { title: "Description", key: "description", value: "description" },
      { title: "Actions", key: "actions", value: "actions" },
    ];
    const quizzes = ref<Quiz[]>([]);

    const quizTableOptions = ref<TableDefaultOptions>({
      itemsPerPage: 8,
      page: 1,
      category_id: +route.params.id,
      search: "",
    });
    const lastPage = ref<number>(1);
    const totalQuizzes = ref<number>(0);

    const quiz = ref<Quiz>({
      id: null,
      name: "",
      description: "",
      category_id: +route.params.id,
    });

    const { loading, onResult, refetch } = useQuery<any, QuizzesQueryRefetch>(
      QUIZZES,
      {
        page: 1,
        name: "",
        category_id: +route.params.id,
      }
    );

    onResult((quizzesResult) => {
      quizzes.value = quizzesResult.data?.quizzes.data;
      lastPage.value = quizzesResult.data?.quizzes.paginatorInfo.lastPage;
      totalQuizzes.value = quizzesResult.data?.quizzes.paginatorInfo.total;
    });

    const reloadQuizzes = ({
      page,
      itemsPerPage,
      search,
    }: TableDefaultOptions) => {
      refetch({
        name: search,
        page,
        first: itemsPerPage,
        category_id: +route.params.id,
      });
      quizTableOptions.value = {
        page,
        itemsPerPage,
        search,
      };
    };

    const quizAddMutation = useMutation(ADD_QUIZ);
    const quizUpdateMutation = useMutation(UPDATE_QUIZ);
    const quizDeleteMutation = useMutation(DELETE_QUIZ);

    const addQuiz = () => {
      quizDialog.value = true;
    };

    const editQuiz = (quizEdit: Category) => {
      quiz.value = JSON.parse(JSON.stringify(quizEdit));
      quizDialog.value = true;
    };

    const saveQuiz = () => {
      if (quiz.value.id) {
        quizUpdateMutation.mutate({
          ...quiz.value,
          category_id: +route.params.id,
        });
        quizUpdateMutation.onDone(() => {
          reloadQuizzes(quizTableOptions.value);
        });
      } else {
        quizAddMutation.mutate(quiz.value);
        quizAddMutation.onDone(() => {
          reloadQuizzes(quizTableOptions.value);
        });
      }
      quiz.value = {
        id: null,
        name: "",
        description: "",
        category_id: +route.params.id,
      };
    };

    const deleteQuiz = async (quizDelete: Quiz) => {
      const shouldProceed = await createConfirmDialog(
        "Confirm Delete Quiz",
        `Delete quiz : ${quizDelete.name}?`,
        { width: 300 }
      );
      if (shouldProceed) {
        quizDeleteMutation.mutate({ id: quizDelete.id });
        quizDeleteMutation.onDone(() => {
          reloadQuizzes(quizTableOptions.value);
        });
      }
    };

    return {
      category,
      loading,
      reloadQuizzes,
      quiz,
      quizzes,
      tableHeaders,
      addQuiz,
      editQuiz,
      saveQuiz,
      deleteQuiz,
      quizTableOptions,
      totalQuizzes,
      quizDialog,
    };
  },
});
</script>

<style scoped>
.quizzes-description {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
