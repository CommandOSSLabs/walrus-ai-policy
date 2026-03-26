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
  package: "0x8037e042ffc131b293f55ba6e43daa209ff3e654a649fe82d52f19bda3a43272",
};

export default {
  networkConfig,
  getSuiClient,
  programs,
};
