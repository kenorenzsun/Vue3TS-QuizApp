import gql from "graphql-tag";

const PAGINATED_QUESTIONS = gql`
  query ($first: Int! = 4, $page: Int!, $quiz_id: ID, $question: String) {
    questions(
      first: $first
      page: $page
      quiz_id: $quiz_id
      question: $question
    ) {
      data {
        id
        question
      }
      paginatorInfo {
        currentPage
        lastPage
        total
      }
    }
  }
`;

export default PAGINATED_QUESTIONS;
