import { GraphQLClient } from "graphql-request";
import { getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc";

const client = new GraphQLClient(getJsonRpcFullnodeUrl("testnet"), {
  mode: "cors",
});

export default {
  client,
};
