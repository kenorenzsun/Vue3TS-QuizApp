<template>
  <div>
    <div class="d-flex">
      <div class="text-h5">
        Question : {{ question.question }}
        <span class="text-subtitle-2">(Quiz : {{ quiz.name }})</span>
      </div>
      <v-spacer></v-spacer>
      <v-btn
        @click="$router.push(`/category/${quiz.category_id}/quiz/${quiz.id}`)"
        >Go Back</v-btn
      >
    </div>
    <div class="text-subtitle-2 mb-3 mt-1">{{ quiz.description }}</div>
    <v-divider></v-divider>
    <div class="d-flex mt-4">
      <div class="text-h5">Questions</div>
      <v-spacer></v-spacer>
      <v-btn density="comfortable" v-if="answers.length < 5" @click="addAnswer"
        >Add Answer</v-btn
      >
    </div>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Answer</th>
          <th class="text-left">Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="answer in answers" :key="answer.id ?? 1">
          <td>{{ answer.answer }}</td>
          <td>
            <v-chip
              class="ma-2"
              :color="answer.is_correct ? 'success' : 'error'"
              variant="outlined"
            >
              <v-icon
                start
                :icon="answer.is_correct ? 'mdi-check' : 'mdi-close'"
              ></v-icon>
              {{ answer.is_correct ? "Correct" : "Wrong" }}
            </v-chip>
          </td>
          <td>
            <v-icon
              v-if="!answer.is_correct"
              color="success"
              size="small"
              class="me-2"
              @click="setAnswerToCorrect(answer)"
            >
              mdi-tag-check
            </v-icon>
            <v-icon
              color="warning"
              size="small"
              class="me-2"
              @click="editAnswer(answer)"
            >
              mdi-pencil
            </v-icon>
            <v-icon size="small" color="error" @click="deleteAnswer(answer)">
              mdi-delete
            </v-icon>
          </td>
        </tr>
      </tbody>
    </v-table>
    <AnswerForm
      :form="answer"
      :dialogState="answerDialog"
      @close="answerDialog = false"
      @save="(answerDialog = false), saveAnswer()"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ref } from "vue";
import { useDialog } from "@/composables/useConfirm";
import Quiz from "@/types/Quiz";
import { useRoute } from "vue-router";
import Question from "@/types/Question";
import { useMutation, useQuery } from "@vue/apollo-composable";
import QUIZ from "@/graphql_api/queries/quiz";
import ADD_ANSWER from "@/graphql_api/mutations/add_answer";
import UPDATE_ANSWER from "@/graphql_api/mutations/update_answer";
import DELETE_ANSWER from "@/graphql_api/mutations/delete_answer";
import SET_ANSWER_TO_CORRECT from "@/graphql_api/mutations/set_answer_to_correct";
import AnswerForm from "@/components/Forms/Answer.vue";
import Answer from "@/types/Answer";
import QUESTION from "@/graphql_api/queries/question";
import ALL_ANSWERS from "@/graphql_api/queries/answer";
export default defineComponent({
  components: {
    AnswerForm,
  },
  setup() {
    const route = useRoute();
    const createConfirmDialog = useDialog();
    const answerDialog = ref<boolean>(false);

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

    const answer = ref<Answer>({
      id: null,
      answer: "",
      question_id: +route.params.question_id,
    });

    const quizQuery = useQuery(QUIZ, {
      id: route.params.quiz_id,
    });
    const questionQuery = useQuery(QUESTION, {
      id: route.params.question_id,
    });

    quizQuery.onResult((quizResult) => {
      quiz.value = quizResult.data?.quiz;
    });
    questionQuery.onResult((questionResult) => {
      question.value = questionResult.data?.question;
    });

    const answers = ref<Answer[]>([]);
    const answersQuery = useQuery(ALL_ANSWERS, {
      question_id: +route.params.question_id,
    });

    answersQuery.onResult((answersResult) => {
      answers.value = answersResult.data?.answers;
    });

    const answerAddMutation = useMutation(ADD_ANSWER);
    const answerUpdateMutation = useMutation(UPDATE_ANSWER);
    const answerDeleteMutation = useMutation(DELETE_ANSWER);
    const answerSetToCorrectMutation = useMutation(SET_ANSWER_TO_CORRECT);

    const addAnswer = () => {
      answerDialog.value = true;
    };

    const editAnswer = (answerEdit: Answer) => {
      answer.value = JSON.parse(JSON.stringify(answerEdit));
      answerDialog.value = true;
    };

    const saveAnswer = () => {
      if (answer.value.id) {
        answerUpdateMutation.mutate({
          ...answer.value,
          question_id: +route.params.question_id,
        });
        answerUpdateMutation.onDone(() => {
          answersQuery.refetch();
        });
      } else {
        answerAddMutation.mutate(answer.value);
        answerAddMutation.onDone(() => {
          answersQuery.refetch();
        });
      }
      answer.value = {
        id: null,
        answer: "",
        question_id: +route.params.question_id,
      };
    };

    const deleteAnswer = async (answerDelete: Answer) => {
      const shouldProceed = await createConfirmDialog(
        "Confirm Delete Answer",
        `Delete answer : ${answerDelete.answer}?`,
        { width: 300 }
      );
      if (shouldProceed) {
        answerDeleteMutation.mutate({ id: answerDelete.id });
        answerDeleteMutation.onDone(() => {
          answersQuery.refetch();
        });
      }
    };

    const setAnswerToCorrect = (answerSet: Answer) => {
      answerSetToCorrectMutation.mutate({
        id: answerSet.id,
        question_id: +route.params.question_id,
      });
      answerSetToCorrectMutation.onDone(() => {
        answersQuery.refetch();
      });
    };

    return {
      question,
      quiz,
      answer,
      answers,
      answerDialog,
      addAnswer,
      editAnswer,
      saveAnswer,
      deleteAnswer,
      setAnswerToCorrect,
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
