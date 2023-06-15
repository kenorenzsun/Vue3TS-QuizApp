import gql from "graphql-tag";

const ALL_ANSWERS = gql`
  query ($question_id: ID!) {
    answers(question_id: $question_id) {
      id
      answer
      is_correct
    }
  }
`;

export default ALL_ANSWERS;
