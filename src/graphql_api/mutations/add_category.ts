import gql from "graphql-tag";

const ADD_CATEGORY = gql`
  mutation createCategory($name: String!, $description: String!) {
    createCategory(name: $name, description: $description) {
      name
      id
      description
    }
  }
`;

export default ADD_CATEGORY;
