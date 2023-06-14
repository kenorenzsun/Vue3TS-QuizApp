import gql from "graphql-tag";

const UPDATE_CATEGORY = gql`
  mutation updateCategory($id: ID!, $name: String!, $description: String!) {
    updateCategory(id: $id, name: $name, description: $description) {
      name
      id
      description
    }
  }
`;

export default UPDATE_CATEGORY;
