import gql from "graphql-tag";

const ADD_ANSWER = gql`
  mutation createAnswer($answer: String!, $question_id: ID!) {
    createAnswer(answer: $answer, question_id: $question_id) {
      answer
      id
    }
  }
`;

export default ADD_ANSWER;
