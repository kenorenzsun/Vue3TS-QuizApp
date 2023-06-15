import gql from "graphql-tag";

const QUIZ = gql`
  query ($id: ID!) {
    quiz(id: $id) {
      id
      name
      description
      category_id
    }
  }
`;

export default QUIZ;
