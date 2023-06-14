import gql from "graphql-tag";

const CATEGORY = gql`
  query ($id: ID!) {
    category(id: $id) {
      id
      name
      description
    }
  }
`;

export default CATEGORY;
