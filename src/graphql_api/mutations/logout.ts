import gql from "graphql-tag";

const LOGOUT = gql`
  mutation logout {
    logout {
      id
      name
      email
    }
  }
`;

export default LOGOUT;
