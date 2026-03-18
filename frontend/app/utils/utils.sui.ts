import { SuiGrpcClient } from "@mysten/sui/grpc";
import { getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc";

const networkConfig = {
  mainnet: {
    url: getJsonRpcFullnodeUrl("mainnet"),
    network: "mainnet",
    appUrl: getJsonRpcFullnodeUrl("mainnet"),
  },
  testnet: {
    url: getJsonRpcFullnodeUrl("testnet"),
    network: "testnet",
    appUrl: getJsonRpcFullnodeUrl("testnet"),
  },
};

const getSuiClient = new SuiGrpcClient({
  network: "testnet",
  baseUrl: networkConfig.testnet.url,
});

const programs = {
  package: "0x479abd3c4a52f7edb0d1a191bc75dc373d17eeab8aedb19d9a4b8e8246c25730",
};

export default {
  networkConfig,
  getSuiClient,
  programs,
};
