import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient(import.meta.env.VITE_GRAPHQL_URL, {
  mode: "cors",
});

export default {
  client,
};
