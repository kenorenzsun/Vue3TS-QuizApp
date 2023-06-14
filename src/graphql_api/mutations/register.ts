import gql from "graphql-tag";

const REGISTER = gql`
  mutation register(
    $name: String!
    $email: String!
    $password: String!
    $password_confirmation: String!
  ) {
    register(
      name: $name
      email: $email
      password: $password
      password_confirmation: $password_confirmation
    ) {
      name
      id
      email
    }
  }
`;

export default REGISTER;
