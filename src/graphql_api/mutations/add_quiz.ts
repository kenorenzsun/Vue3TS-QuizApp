import gql from "graphql-tag";

const ADD_QUIZ = gql`
  mutation createQuiz(
    $name: String!
    $description: String!
    $category_id: ID!
  ) {
    createQuiz(
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

export default ADD_QUIZ;
