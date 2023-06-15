import gql from "graphql-tag";

const DELETE_ANSWER = gql`
  mutation deleteAnswer($id: ID!) {
    deleteAnswer(id: $id) {
      answer
      id
    }
  }
`;

export default DELETE_ANSWER;
