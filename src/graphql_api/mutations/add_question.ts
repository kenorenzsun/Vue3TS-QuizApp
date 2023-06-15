import gql from "graphql-tag";

const ADD_QUESTION = gql`
  mutation createQuestion($question: String!, $quiz_id: ID!) {
    createQuestion(question: $question, quiz_id: $quiz_id) {
      question
      id
    }
  }
`;

export default ADD_QUESTION;
