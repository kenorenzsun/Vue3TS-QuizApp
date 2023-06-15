import gql from "graphql-tag";

const QUESTION = gql`
  query ($id: ID!) {
    question(id: $id) {
      id
      question
    }
  }
`;

export default QUESTION;
