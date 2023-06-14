import gql from "graphql-tag";

const DELETE_CATEGORY = gql`
  mutation deleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      name
      id
      description
    }
  }
`;

export default DELETE_CATEGORY;
