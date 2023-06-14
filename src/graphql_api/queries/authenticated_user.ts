import gql from "graphql-tag";

const AUTHENTICATED_USER = gql`
  query me {
    me {
      id
      name
      email
    }
  }
`;

export default AUTHENTICATED_USER;
