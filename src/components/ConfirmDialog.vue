<template>
  <slot />
  <v-dialog
    v-model="isOpen"
    :max-width="options.width"
    :persistent="options.persistent"
  >
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text v-show="!!content">{{ content }}</v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn v-show="!!options.showCancel" color="primary" @click="cancel"
          >Cancel</v-btn
        >
        <v-btn color="error" @click="agree">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { reactive, toRefs, provide } from "vue";
import {
  CreateConfirmDialogKey,
  CreateConfirmDialogOptions,
} from "@/composables/useConfirm";

export default {
  setup() {
    const state = reactive({
      isOpen: false,
      resolve: (_val: boolean) => {},
      reject: (_val: boolean) => {},
      content: "",
      title: "",
      options: {
        width: 300,
        showCancel: true,
        persistent: false,
      } as CreateConfirmDialogOptions,
    });
    const createConfirmDialog = (
      title: string,
      content: string,
      options: CreateConfirmDialogOptions = {}
    ) => {
      state.isOpen = true;
      state.title = title;
      state.content = content;
      state.options = Object.assign(state.options, options);
      return new Promise<boolean>((resolve, reject) => {
        state.resolve = resolve;
        state.reject = reject;
      });
    };
    provide(CreateConfirmDialogKey, createConfirmDialog);
    const agree = () => {
      state.resolve(true);
      state.isOpen = false;
    };
    const cancel = () => {
      state.resolve(false);
      state.isOpen = false;
    };
    return {
      ...toRefs(state),
      agree,
      cancel,
    };
  },
};
</script>
