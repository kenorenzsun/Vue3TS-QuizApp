import gql from "graphql-tag";

const CATEGORIES = gql`
  query {
    allCategories {
      id
      name
    }
  }
`;

export default CATEGORIES;
