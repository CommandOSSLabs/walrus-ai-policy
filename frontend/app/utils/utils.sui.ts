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
  package: "0x2809bd901744192d5845f5afc07e4ebacadcc0530932b5c2d602a846c7c21fd5",
};

export default {
  networkConfig,
  getSuiClient,
  programs,
};
