import gql from "graphql-tag";

const PAGINATED_CATEGORIES = gql`
  query ($first: Int!, $page: Int!, $name: String) {
    categories(first: $first, page: $page, name: $name) {
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

export default PAGINATED_CATEGORIES;
