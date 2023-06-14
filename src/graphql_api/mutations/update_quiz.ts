import gql from "graphql-tag";

const UPDATE_QUIZ = gql`
  mutation updateQuiz(
    $id: ID!
    $name: String!
    $description: String!
    $category_id: ID!
  ) {
    updateQuiz(
      id: $id
      name: $name
      description: $description
      category_id: $category_id
    ) {
      name
      id
      description
    }
  }
`;

export default UPDATE_QUIZ;
