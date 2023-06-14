import gql from "graphql-tag";

const DELETE_QUIZ = gql`
  mutation deleteQuiz($id: ID!) {
    deleteQuiz(id: $id) {
      name
      id
      description
    }
  }
`;

export default DELETE_QUIZ;
