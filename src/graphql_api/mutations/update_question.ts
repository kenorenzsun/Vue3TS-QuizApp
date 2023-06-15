import gql from "graphql-tag";

const UPDATE_QUESTION = gql`
  mutation updateQuestion($id: ID!, $question: String!, $quiz_id: ID!) {
    updateQuestion(id: $id, question: $question, quiz_id: $quiz_id) {
      question
      id
    }
  }
`;

export default UPDATE_QUESTION;
