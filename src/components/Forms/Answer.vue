<template>
  <v-row justify="center">
    <v-dialog v-model="modalState" persistent max-width="600px">
      <v-card class="px-2 py-2">
        <v-card-title>
          <span class="text-h5">{{ form.id ? "Edit" : "Create" }} Answer</span>
        </v-card-title>
        <v-card-text class="px-0 py-0">
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-form ref="formRef" lazy-validation>
                  <v-text-field
                    label="Answer*"
                    required
                    :rules="answerRule"
                    v-model="form.answer"
                    density="comfortable"
                  ></v-text-field>
                </v-form>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text="true" @click="reset(), $emit('close')">
            Close
          </v-btn>
          <v-btn color="primary" text="true" @click="validate"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script lang="ts">
import Answer from "@/types/Answer";
import { ref } from "vue";
import { computed } from "vue";
import { ComputedRef } from "vue";
import { PropType } from "vue";

export default {
  props: {
    dialogState: {
      type: Boolean,
      required: true,
    },
    form: {
      type: Object as PropType<Answer>,
      required: true,
      default: {
        id: null,
        answer: "",
        question_id: null,
      },
    },
  },
  emits: ["save", "close"],
  setup(props, { emit }) {
    const formRef = ref<HTMLFormElement>();

    const modalState: ComputedRef<boolean> = computed(
      (): boolean => props.dialogState
    );
    const answerRule = [(v: string) => !!v || "Answer is required"];

    const reset = () => {
      formRef.value?.reset();
    };
    const resetValidation = () => {
      formRef.value?.resetValidation();
    };

    const validate = async () => {
      const { valid } = await formRef.value?.validate();

      if (valid) {
        emit("save");
        reset();
      }
    };

    return {
      formRef,
      modalState,
      answerRule,
      validate,
      resetValidation,
      reset,
    };
  },
};
</script>
