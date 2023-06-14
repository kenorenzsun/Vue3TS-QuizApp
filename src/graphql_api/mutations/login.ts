import gql from "graphql-tag";

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        name
        email
      }
      accessToken
    }
  }
`;

export default LOGIN;
