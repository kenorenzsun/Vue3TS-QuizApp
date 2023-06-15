import gql from "graphql-tag";

const DELETE_QUESTION = gql`
  mutation deleteQuestion($id: ID!) {
    deleteQuestion(id: $id) {
      question
      id
    }
  }
`;

export default DELETE_QUESTION;
