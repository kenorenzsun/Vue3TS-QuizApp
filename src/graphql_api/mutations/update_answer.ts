import gql from "graphql-tag";

const UPDATE_ANSWER = gql`
  mutation updateAnswer($id: ID!, $answer: String!, $question_id: ID!) {
    updateAnswer(id: $id, answer: $answer, question_id: $question_id) {
      answer
      id
    }
  }
`;

export default UPDATE_ANSWER;
