<template>
  <div>
    <div class="d-flex mb-3">
      <div class="text-h4">Categories</div>
      <v-spacer></v-spacer>
      <v-btn density="comfortable" icon="mdi-plus" @click="addCategory"></v-btn>
      <v-spacer></v-spacer>

      <v-text-field
        v-model="categoryTableOptions.search"
        hide-details
        placeholder="Search name..."
        density="compact"
        prepend-inner-icon="mdi-magnify"
      ></v-text-field>
    </div>
    <v-data-table-server
      ref="table"
      v-model:items-per-page="categoryTableOptions.itemsPerPage"
      :headers="tableHeaders"
      :items-length="totalCategories"
      :items="categories"
      :search="categoryTableOptions.search"
      :loading="loading"
      class="elevation-1"
      item-value="name"
      @update:options="reloadCategories"
    >
      <template v-slot:item.description="{ item }">
        <div class="categories-description">{{ item.raw.description }}</div>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          color="primary"
          size="small"
          class="me-2"
          @click="$router.push(`/category/${item.raw.id}`)"
        >
          mdi-eye
        </v-icon>
        <v-icon
          color="warning"
          size="small"
          class="me-2"
          @click="editCategory(item.raw)"
        >
          mdi-pencil
        </v-icon>
        <v-icon size="small" color="error" @click="deleteCategory(item.raw)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table-server>
    <CategoryForm
      :form="category"
      :dialogState="categoryDialog"
      @close="categoryDialog = false"
      @save="(categoryDialog = false), saveCategory()"
    />
  </div>
</template>

<script lang="ts">
import { useMutation, useQuery } from "@vue/apollo-composable";
import { defineComponent } from "vue";
import { ref } from "vue";
import Category from "@/types/Category";
import PAGINATED_CATEGORIES from "@/graphql_api/queries/paginated_categories";
import ADD_CATEGORY from "@/graphql_api/mutations/add_category";
import UPDATE_CATEGORY from "@/graphql_api/mutations/update_category";
import DELETE_CATEGORY from "@/graphql_api/mutations/delete_category";
import CategoriesQueryRefetch from "@/types/CategoriesQueryRefetch";
import ReadOnlyDataTableHeader from "@/types/ReadOnlyDataTableHeader";
import CategoryForm from "@/components/Forms/Category.vue";
import TableDefaultOptions from "@/types/TableDefaultOptions";
import { useDialog } from "@/composables/useConfirm";

export default defineComponent({
  components: {
    CategoryForm,
  },
  setup() {
    const createConfirmDialog = useDialog();
    const tableHeaders: ReadOnlyDataTableHeader[] = [
      {
        title: "Name",
        value: "name",
        key: "name",
      },
      { title: "Description", key: "description", value: "description" },
      { title: "Actions", key: "actions", value: "actions" },
    ];
    const categories = ref<Category[]>([]);
    const categoryTableOptions = ref<TableDefaultOptions>({
      itemsPerPage: 8,
      page: 1,
      search: "",
    });
    const lastPage = ref<number>(1);
    const totalCategories = ref<number>(0);
    const categoryDialog = ref<boolean>(false);
    const category = ref<Category>({
      id: null,
      name: "",
      description: "",
    });

    const { loading, onResult, refetch } = useQuery<
      any,
      CategoriesQueryRefetch
    >(PAGINATED_CATEGORIES, {
      page: categoryTableOptions.value.page,
      first: categoryTableOptions.value.itemsPerPage,
      name: "",
    });

    const categoryAddMutation = useMutation(ADD_CATEGORY);
    const categoryUpdateMutation = useMutation(UPDATE_CATEGORY);
    const categoryDeleteMutation = useMutation(DELETE_CATEGORY);

    onResult((categoriesResult) => {
      categories.value = categoriesResult.data?.categories.data;
      lastPage.value = categoriesResult.data?.categories.paginatorInfo.lastPage;
      totalCategories.value =
        categoriesResult.data?.categories.paginatorInfo.total;
    });

    const reloadCategories = ({
      page,
      itemsPerPage,
      search,
    }: TableDefaultOptions) => {
      refetch({
        name: search,
        page,
        first: itemsPerPage,
      });
      categoryTableOptions.value = {
        page,
        itemsPerPage,
        search,
      };
    };

    const addCategory = () => {
      categoryDialog.value = true;
    };

    const editCategory = (categoryEdit: Category) => {
      category.value = JSON.parse(JSON.stringify(categoryEdit));
      categoryDialog.value = true;
    };

    const saveCategory = () => {
      if (category.value.id) {
        categoryUpdateMutation.mutate(category.value);
        categoryUpdateMutation.onDone(() => {
          reloadCategories(categoryTableOptions.value);
        });
      } else {
        categoryAddMutation.mutate(category.value);
        categoryAddMutation.onDone(() => {
          reloadCategories(categoryTableOptions.value);
        });
      }
      category.value = {
        id: null,
        name: "",
        description: "",
      };
    };

    const deleteCategory = async (categoryDelete: Category) => {
      const shouldProceed = await createConfirmDialog(
        "Confirm Delete Category",
        `Delete category : ${categoryDelete.name}?`,
        { width: 300 }
      );
      if (shouldProceed) {
        categoryDeleteMutation.mutate({ id: categoryDelete.id });
        categoryDeleteMutation.onDone(() => {
          reloadCategories(categoryTableOptions.value);
        });
      }
    };

    return {
      loading,
      categoryTableOptions,
      reloadCategories,
      lastPage,
      categories,
      totalCategories,
      tableHeaders,
      categoryDialog,
      category,
      addCategory,
      editCategory,
      deleteCategory,
      saveCategory,
    };
  },
});
</script>

<style scoped>
.categories-description {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
