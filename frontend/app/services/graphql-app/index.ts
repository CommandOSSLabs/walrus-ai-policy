import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient(
  "https://wal-archive-graphql-app-develop.up.railway.app/graphql",
  {
    mode: "cors",
  },
);

export default {
  client,
};
