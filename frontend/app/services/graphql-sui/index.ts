import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient("https://graphql.testnet.sui.io/graphql", {
  mode: "cors",
});

export default {
  client,
};
