import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient(import.meta.env.VITE_SUI_GRAPHQL, {
  mode: "cors",
});

export default {
  client,
};
