import gql from "graphql-tag";

const QUIZZES = gql`
  query ($first: Int! = 4, $page: Int!, $name: String, $category_id: ID) {
    quizzes(
      page: $page
      first: $first
      name: $name
      category_id: $category_id
    ) {
      data {
        id
        name
        description
      }
      paginatorInfo {
        currentPage
        lastPage
        total
      }
    }
  }
`;

export default QUIZZES;
