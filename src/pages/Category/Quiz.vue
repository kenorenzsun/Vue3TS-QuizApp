<template>
  <div>
    <div class="d-flex">
      <div class="text-h5">
        Quiz : {{ quiz.name }}
        <span class="text-subtitle-2">(Category : {{ category.name }})</span>
      </div>
      <v-spacer></v-spacer>
      <v-btn @click="$router.push(`/category/${category.id}`)">Go Back</v-btn>
    </div>
    <div class="text-subtitle-2 mb-3 mt-1">{{ quiz.description }}</div>
    <v-divider></v-divider>
    <div class="d-flex mt-4">
      <div class="text-h5">Questions</div>
      <v-spacer></v-spacer>
      <v-btn density="comfortable" @click="addQuestion">Add Question</v-btn>
      <v-spacer></v-spacer>

      <v-text-field
        v-model="questionTableOptions.search"
        hide-details
        placeholder="Search name..."
        density="compact"
        prepend-inner-icon="mdi-magnify"
      ></v-text-field>
    </div>
    <v-data-table-server
      ref="table"
      v-model:items-per-page="questionTableOptions.itemsPerPage"
      :headers="tableHeaders"
      :items-length="totalQuestions"
      :items="questions"
      :search="questionTableOptions.search"
      :loading="loading"
      class="elevation-1"
      item-value="name"
      @update:options="reloadQuestions"
    >
      <template v-slot:item.description="{ item }">
        <div class="quizzes-description">{{ item.raw.description }}</div>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          color="primary"
          size="small"
          class="me-2"
          @click="
            $router.push(
              `/category/${category.id}/quiz/${quiz.id}/question/${item.raw.id}`
            )
          "
        >
          mdi-eye
        </v-icon>
        <v-icon
          color="warning"
          size="small"
          class="me-2"
          @click="editQuestion(item.raw)"
        >
          mdi-pencil
        </v-icon>
        <v-icon size="small" color="error" @click="deleteQuestion(item.raw)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table-server>
    <QuestionForm
      :form="question"
      :dialogState="questionDialog"
      @close="questionDialog = false"
      @save="(questionDialog = false), saveQuestion()"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ref } from "vue";
import ReadOnlyDataTableHeader from "@/types/ReadOnlyDataTableHeader";
import { useDialog } from "@/composables/useConfirm";
import Quiz from "@/types/Quiz";
import { useRoute } from "vue-router";
import Category from "@/types/Category";
import Question from "@/types/Question";
import QuestionsQueryRefetch from "@/types/QuestionsQueryRefetch";
import { useMutation, useQuery } from "@vue/apollo-composable";
import CATEGORY from "@/graphql_api/queries/category";
import QUIZ from "@/graphql_api/queries/quiz";
import PAGINATED_QUESTIONS from "@/graphql_api/queries/questions";
import TableDefaultOptions from "@/types/TableDefaultOptions";
import ADD_QUESTION from "@/graphql_api/mutations/add_question";
import UPDATE_QUESTION from "@/graphql_api/mutations/update_question";
import DELETE_QUESTION from "@/graphql_api/mutations/delete_question";
import QuestionForm from "@/components/Forms/Question.vue";
export default defineComponent({
  components: {
    QuestionForm,
  },
  setup() {
    const route = useRoute();
    const createConfirmDialog = useDialog();
    const questionDialog = ref<boolean>(false);

    const category = ref<Category>({
      id: null,
      name: "",
      description: "",
    });

    const quiz = ref<Quiz>({
      id: null,
      name: "",
      description: "",
    });

    const question = ref<Question>({
      id: null,
      question: "",
      quiz_id: +route.params.quiz_id,
    });

    const categoryQuery = useQuery(CATEGORY, {
      id: route.params.id,
    });
    const quizQuery = useQuery(QUIZ, {
      id: route.params.quiz_id,
    });

    categoryQuery.onResult((categoryResult) => {
      category.value = categoryResult.data?.category;
    });
    quizQuery.onResult((quizResult) => {
      quiz.value = quizResult.data?.quiz;
    });

    const tableHeaders: ReadOnlyDataTableHeader[] = [
      {
        title: "Question",
        value: "question",
        key: "question",
      },
      { title: "Actions", key: "actions", value: "actions" },
    ];

    const questions = ref<Question[]>([]);
    const questionTableOptions = ref<TableDefaultOptions>({
      itemsPerPage: 8,
      page: 1,
      quiz_id: +route.params.quiz_id,
      search: "",
    });
    const lastPage = ref<number>(1);
    const totalQuestions = ref<number>(0);

    const { loading, onResult, refetch } = useQuery<any, QuestionsQueryRefetch>(
      PAGINATED_QUESTIONS,
      {
        page: 1,
        question: "",
        quiz_id: +route.params.quiz_id,
      }
    );

    onResult((questionsResult) => {
      questions.value = questionsResult.data?.questions.data;
      lastPage.value = questionsResult.data?.questions.paginatorInfo.lastPage;
      totalQuestions.value =
        questionsResult.data?.questions.paginatorInfo.total;
    });

    const reloadQuestions = ({
      page,
      itemsPerPage,
      search,
    }: TableDefaultOptions) => {
      refetch({
        question: search,
        page,
        first: itemsPerPage,
        quiz_id: +route.params.quiz_id,
      });
      questionTableOptions.value = {
        page,
        itemsPerPage,
        search,
      };
    };

    const questionAddMutation = useMutation(ADD_QUESTION);
    const questionUpdateMutation = useMutation(UPDATE_QUESTION);
    const questionDeleteMutation = useMutation(DELETE_QUESTION);

    const addQuestion = () => {
      questionDialog.value = true;
    };

    const editQuestion = (questionEdit: Category) => {
      question.value = JSON.parse(JSON.stringify(questionEdit));
      questionDialog.value = true;
    };

    const saveQuestion = () => {
      if (question.value.id) {
        questionUpdateMutation.mutate({
          ...question.value,
          quiz_id: +route.params.quiz_id,
        });
        questionUpdateMutation.onDone(() => {
          reloadQuestions(questionTableOptions.value);
        });
      } else {
        questionAddMutation.mutate(question.value);
        questionAddMutation.onDone(() => {
          reloadQuestions(questionTableOptions.value);
        });
      }
      question.value = {
        id: null,
        question: "",
        quiz_id: +route.params.quiz_id,
      };
    };

    const deleteQuestion = async (questionDelete: Question) => {
      const shouldProceed = await createConfirmDialog(
        "Confirm Delete Question",
        `Delete question : ${questionDelete.question}?`,
        { width: 300 }
      );
      if (shouldProceed) {
        questionDeleteMutation.mutate({ id: questionDelete.id });
        questionDeleteMutation.onDone(() => {
          reloadQuestions(questionTableOptions.value);
        });
      }
    };

    return {
      category,
      quiz,
      reloadQuestions,
      totalQuestions,
      loading,
      tableHeaders,
      questionTableOptions,
      question,
      questions,
      questionDialog,
      addQuestion,
      editQuestion,
      saveQuestion,
      deleteQuestion,
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
