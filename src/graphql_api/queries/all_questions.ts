import gql from "graphql-tag";

const ALL_QUESTIONS = gql`
  query {
    allQuestions {
      id
      description
      name
    }
  }
`;

export default ALL_QUESTIONS;
