import gql from "graphql-tag";

const SET_ANSWER_TO_CORRECT = gql`
  mutation setAnswerToCorrect($id: ID!, $question_id: ID!) {
    setAnswerToCorrect(id: $id, question_id: $question_id) {
      answer
      id
    }
  }
`;

export default SET_ANSWER_TO_CORRECT;
