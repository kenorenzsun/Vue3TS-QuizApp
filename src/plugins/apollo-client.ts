import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { getUserToken } from "../helpers/localStorageHelper";

const getAuthToken = getUserToken();

const httpLink = createHttpLink({
  uri: "http://localhost:8001/graphql",
  headers: {
    authorization: getAuthToken ? `Bearer ${getAuthToken}` : "",
  },
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});

export default apolloClient;
